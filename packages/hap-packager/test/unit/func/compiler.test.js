/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const { replaceModuleImport } = require('@hap-toolkit/compiler').scripter
const { parseLifecycle, parseTemplate } = require('@hap-toolkit/compiler')
const { postHandleLiteCardRes } = require('../../../lib/post-handler/lite-card-post')

describe('compile functions', () => {
  it('replaceModuleImport', () => {
    const importExp1 = replaceModuleImport(`
      import $utils from './utils'
      import fetch from '@system.fetch'
      import prompt from '@system.prompt'
    `)
    const importExp2 = replaceModuleImport(`
      import $utils from './utils'
      import system from '@system'
    `)
    const requireExp1 = replaceModuleImport(`
      const fetch = require('@system.fetch')
      const prompt = require("@system.prompt")
    `)
    const requireExp2 = replaceModuleImport(`
      const fetch = require('@system.fetch')
      const system = require("@system")
    `)

    expect(importExp1).toMatchSnapshot()
    expect(importExp2).toMatchSnapshot()

    expect(requireExp1).toMatchSnapshot()
    expect(requireExp2).toMatchSnapshot()
  })
})

/**
 * 轻卡需求一：create/update params 表达式编译
 * <data> 块中的顶层 create/update 的 params 中的 {{ expr }} 需要编译为 JSON AST，
 * 编译规则与 actions params 一致（#key 为 AST，$key 为原文，纯静态值保持原样）。
 * 编译产出中 create/update 为 #entry 顶层字段（不再包裹 lifecycle 一层）。
 */
describe('轻卡 create/update params 编译', () => {
  it('parseLifecycle 校验单个钩子并返回合法 JSON', () => {
    const { parsed } = parseLifecycle({
      params: {
        lat: "{{ system.geolocation.getLocation({coordType:'gcj02'}).latitude }}",
        deviceType: '{{ system.device.DEVICE_TYPE }}'
      }
    })
    const obj = JSON.parse(parsed)
    expect(obj.params.lat).toBeDefined()
    expect(obj.params.deviceType).toBeDefined()
  })

  it('parseLifecycle 拒绝以 $ 开头的 params 参数名', () => {
    expect(() => {
      parseLifecycle({ params: { $bad: '{{ a }}' } })
    }).toThrow()
  })

  it('parseLifecycle 拒绝多级结构中绑定变量', () => {
    expect(() => {
      parseLifecycle({ params: { obj: { nested: '{{ a }}' } } })
    }).toThrow()
  })

  it('postHandleLiteCardRes 将 create/update params 中的 {{ expr }} 编译为 #/$ AST', () => {
    const liteCardRes = {
      '#entry': {
        template: { type: 'div', children: [] },
        data: { title: 'x' },
        create: {
          params: {
            lat: "{{ system.geolocation.getLocation({coordType:'gcj02'}).latitude }}",
            deviceType: '{{ system.device.DEVICE_TYPE }}',
            staticVal: 'plain-string'
          }
        },
        update: {
          params: {
            deviceType: '{{ system.device.DEVICE_TYPE }}'
          }
        }
      }
    }
    const res = postHandleLiteCardRes(liteCardRes)
    const createParams = res['#entry'].create.params

    // create/update 是 #entry 顶层字段，没有 lifecycle 包裹
    expect(res['#entry'].lifecycle).toBeUndefined()
    // 表达式被编译为 #key(AST) + $key(原文) 对
    expect(Array.isArray(createParams['#lat'])).toBe(true)
    expect(createParams['#lat'][0]).toBe('.')
    expect(createParams).toHaveProperty('$lat')
    expect(Array.isArray(createParams['#deviceType'])).toBe(true)
    // 纯静态值保持原样，不加前缀
    expect(createParams.staticVal).toBe('plain-string')
    expect(createParams['#staticVal']).toBeUndefined()
    // update.params 同样被编译
    expect(Array.isArray(res['#entry'].update.params['#deviceType'])).toBe(true)

    // 记录完整编译产物，锁定 AST 格式
    expect(createParams).toMatchSnapshot()
  })

  it('create/update 编译不影响 actions / data 的既有行为', () => {
    const liteCardRes = {
      '#entry': {
        template: { type: 'div', children: [] },
        data: { title: 'x' },
        actions: {
          onTap: { type: 'message', params: { d: '{{ system.device.DEVICE_TYPE }}' } }
        },
        create: { params: { a: '{{ system.device.DEVICE_TYPE }}' } }
      }
    }
    const res = postHandleLiteCardRes(liteCardRes)
    expect(Array.isArray(res['#entry'].actions.onTap.params['#d'])).toBe(true)
    expect(res['#entry'].data.title).toBe('x')
  })
})

/**
 * 轻卡需求二：模板中禁止耗时 Feature 调用（编译期校验）
 * <template> 表达式在 UI 线程同步执行，耗时 Feature（geolocation.getLocation / push.subscribe）
 * 出现在模板表达式中需编译报错；出现在 create/update params / action params 中则放行。
 */
describe('轻卡模板耗时 Feature 编译期校验', () => {
  // parseTemplate 接收的是 <template> 片段内部内容（根为 <div>），不含 <template> 包裹
  function compileLiteTpl(inner) {
    return parseTemplate(inner, {
      uxType: 'card',
      lite: '1',
      filePath: '/tmp/liteWidgets/feature_test/index.ux'
    })
  }
  function hasForbiddenError(res) {
    return res.log.some((l) => /不允许在模板表达式中使用/.test(l.reason || ''))
  }

  it('模板文本表达式中调用 geolocation.getLocation 报错', () => {
    const res = compileLiteTpl(
      `<div><text>{{ system.geolocation.getLocation().latitude }}</text></div>`
    )
    expect(hasForbiddenError(res)).toBe(true)
    const err = res.log.find((l) => /不允许/.test(l.reason))
    expect(err.reason).toContain('system.geolocation.getLocation')
    expect(err.reason).toContain('create.params')
    expect(err.line).toBeDefined()
    // 标记为致命错误，template-loader 据此上报 webpack 错误以中断构建
    expect(err.fatal).toBe(true)
  })

  it('模板属性表达式中调用 service.push.subscribe 报错', () => {
    const res = compileLiteTpl(
      `<div class="a"><image src="{{ service.push.subscribe().id }}"></image></div>`
    )
    expect(hasForbiddenError(res)).toBe(true)
  })

  it('模板中非耗时 Feature（system.device）不报错', () => {
    const res = compileLiteTpl(`<div><text>{{ system.device.DEVICE_TYPE }}</text></div>`)
    expect(hasForbiddenError(res)).toBe(false)
  })

  it('模板中 package.hasInstalled 三元表达式不报错', () => {
    const res = compileLiteTpl(
      `<div><text>{{ system.package.hasInstalled({package:'com.meituan'}).result ? 'y' : 'n' }}</text></div>`
    )
    expect(hasForbiddenError(res)).toBe(false)
  })

  it('相似但不同路径（foo.system.geolocation.getLocation）不误报', () => {
    const res = compileLiteTpl(`<div><text>{{ foo.system.geolocation.getLocation() }}</text></div>`)
    expect(hasForbiddenError(res)).toBe(false)
  })

  it('create/update params 中的耗时 Feature 放行（不经模板校验）', () => {
    expect(() => {
      parseLifecycle({ params: { lat: '{{ system.geolocation.getLocation().latitude }}' } })
    }).not.toThrow()
  })
})
