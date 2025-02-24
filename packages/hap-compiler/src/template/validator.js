/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import { colorconsole, extend } from '@hap-toolkit/shared-utils'
import exp from './exp'
import styler from '../style'
import checkModel from './model'
import {
  fileExists,
  resolvePath,
  hyphenedToCamelCase,
  merge,
  isValidValue,
  FRAG_TYPE,
  ENTRY_TYPE
} from '../utils'

// 支持的后缀名列表
const extList = ['.mix', '.ux']
// 富文本支持的类型
const richtextType = ['mix', 'ux']

// 标签拥有data属性
const REG_TAG_DATA_ATTR = /^data-\w+/

// class属性
const REG_CLASS_VALUE = /[^{}\s]+((?=\s)|$)|[^{}\s]*\{\{[^]*?\}\}[^\s]*/g

// 保留标签名
const RESERVED_TAGS = Object.keys(FRAG_TYPE).map((k) => FRAG_TYPE[k])

// 保留指令名
const RESERVED_DIRECTIVES = /^(model:|dir:)/

// 公共属性定义
const tagCommon = {
  events: [
    'click',
    'focus',
    'blur',
    'key',
    'longpress',
    'appear',
    'disappear',
    'swipe',
    'touchstart',
    'touchmove',
    'touchend',
    'touchcancel',
    'resize',
    'animationstart',
    'animationiteration',
    'animationend'
  ],
  attrs: {
    id: {},
    style: {},
    class: {},
    disabled: {
      enum: ['false', 'true']
    },
    if: {
      def: 'true' // 缺省值
    },
    elif: {
      def: 'true'
    },
    else: {},
    for: {},
    tid: {},
    show: {
      def: 'true'
    },
    'aria-label': {},
    'aria-unfocusable': {
      enum: ['false', 'true']
    },
    forcedark: {
      enum: ['true', 'false']
    },
    focusable: {
      enum: ['false', 'true']
    },
    vtags: {},
    vindex: {},
    autofocus: {
      enum: ['false', 'true']
    },
    descendantfocusability: {
      enum: ['before', 'after', 'block']
    }
  },
  children: ['block', 'slot', 'component'], // 通用控制组件
  parents: ['block'] // 通用父组件
}

// 原生标签定义
// atomic: 不允许有子节点，但允许#text内容
// empty: 是否为空元素——不可能存在子节点(内嵌的元素或文本)
// supportCard：是否支持卡片，默认不支持卡片
const tagNatives = {
  div: {
    supportCard: true,
    attrs: {
      enablevideofullscreencontainer: {
        enum: ['false', 'true']
      }
    }
  },
  a: {
    supportCard: true,
    textContent: true,
    children: ['span'],
    attrs: {
      visited: {
        enum: ['false', 'true']
      },
      href: {}
    }
  },
  text: {
    supportCard: true,
    textContent: true,
    children: ['a', 'span'],
    attrs: {
      type: {
        enum: ['text', 'html']
      },
      'letter-spacing': {}
    }
  },
  span: {
    supportCard: true,
    textContent: true,
    excludeRoot: true,
    children: ['span'],
    parents: ['text', 'a', 'span'],
    attrs: {
      extendCommon: false, // 不支持通用属性
      id: {},
      style: {},
      class: {},
      for: {},
      tid: {},
      if: {
        def: 'true'
      },
      elif: {
        def: 'true'
      },
      else: {}
    }
  },
  label: {
    supportCard: true,
    textContent: true,
    atomic: true,
    attrs: {
      target: {}
    }
  },
  image: {
    events: ['complete', 'error'],
    empty: true,
    supportCard: true,
    selfClosing: true,
    alias: ['img'],
    atomic: true,
    attrs: {
      src: {},
      alt: {},
      enablenightmode: {
        enum: ['true', 'false']
      },
      autoplay: {
        enum: ['true', 'false']
      }
    }
  },
  slider: {
    selfClosing: true,
    atomic: true,
    attrs: {
      enabled: {
        enum: ['true', 'false']
      },
      min: {
        def: 0
      },
      max: {
        def: 100
      },
      step: {
        def: 1
      },
      value: {
        def: 0
      }
    },
    events: ['change']
  },
  web: {
    atomic: true,
    events: ['pagestart', 'pagefinish', 'titlereceive', 'error', 'message', 'progress'],
    attrs: {
      src: {},
      trustedurl: {},
      allowthirdpartycookies: {
        enum: ['false', 'true']
      },
      enablenightmode: {
        enum: ['true', 'false']
      },
      showloadingdialog: {
        enum: ['false', 'true']
      },
      supportzoom: {
        enum: ['true', 'false']
      }
    }
  },
  list: {
    children: ['list-item'],
    attrs: {
      scrollpage: {
        enum: ['false', 'true']
      },
      focusbehavior: {
        enum: ['aligned', 'edged']
      }
    },
    events: ['scroll', 'scrollbottom', 'scrolltop', 'scrollend', 'scrolltouchup', 'selected']
  },
  'list-item': {
    excludeRoot: true,
    parents: ['list'],
    attrs: {
      type: {
        required: true
      },
      disallowintercept: {}
    }
  },
  block: {
    excludeRoot: true,
    supportCard: true,
    attrs: {
      extendCommon: false, // 不支持通用属性
      for: {},
      tid: {},
      if: {
        def: 'true'
      },
      elif: {
        def: 'true'
      },
      else: {}
    }
  },
  component: {
    supportCard: true,
    excludeRoot: true,
    attrs: {
      extendCommon: false, // 不支持通用属性
      is: {
        required: true
      },
      for: {},
      tid: {},
      if: {
        def: 'true'
      },
      elif: {
        def: 'true'
      },
      else: {}
    }
  },
  slot: {
    excludeRoot: true,
    attrs: {
      name: {
        def: 'default'
      },
      extendCommon: false, // 不支持通用属性
      content: {}
    }
  },
  input: {
    supportCard: true,
    selfClosing: true,
    atomic: true,
    empty: true,
    attrs: {
      type: {
        enum: [
          'text',
          'button',
          'checkbox',
          'radio',
          'email',
          'date',
          'time',
          'number',
          'password',
          'tel',
          'eventbutton',
          'hidetext',
          'showtext'
        ]
      },
      autocomplete: {
        enum: ['on', 'off']
      },
      enterkeytype: {
        enum: ['default', 'next', 'go', 'done', 'send', 'search']
      },
      eventtype: {
        enum: ['shortcut']
      },
      'true-value': {},
      'false-value': {},
      maxlength: {},
      checked: {
        enum: ['false', 'true']
      },
      name: {},
      value: {},
      placeholder: {}
    },
    events: ['change', 'enterkeyclick', 'selectionchange']
  },
  button: {
    supportCard: true,
    textContent: true,
    atomic: true
  },
  refresh: {
    attrs: {
      offset: {
        def: '132px'
      },
      refreshing: {
        enum: ['false', 'true']
      },
      type: {
        enum: ['auto', 'pulldown']
      },
      'enable-refresh': {
        enum: ['true', 'false']
      }
    },
    events: ['refresh']
  },
  refresh2: {
    attrs: {
      pulldownrefreshing: {
        enum: ['false', 'true']
      },
      pulluprefreshing: {
        enum: ['false', 'true']
      },
      animationduration: {
        def: 300
      },
      enablepulldown: {
        enum: ['true', 'false']
      },
      enablepullup: {
        enum: ['false', 'true']
      },
      reboundable: {
        enum: ['false', 'true']
      },
      gesture: {
        enum: ['true', 'false']
      },
      offset: {
        def: '132px'
      },
      refreshing: {
        enum: ['false', 'true']
      },
      type: {
        enum: ['auto', 'pulldown']
      }
    },
    events: ['pulldownrefresh', 'pulluprefresh', 'refresh'],
    // 对于只允许出现一次的子节点，保留最后一个
    onceChildren: ['refresh-header', 'refresh-footer']
  },
  'refresh-header': {
    attrs: {
      dragrate: {
        def: 300
      },
      triggerratio: {
        def: 300
      },
      tiggersize: {
        def: 300
      },
      maxdragratio: {
        def: 300
      },
      maxdragsize: {
        def: 300
      },
      refreshdisplayratio: {
        def: 300
      },
      refreshdisplaysize: {
        def: 300
      },
      spinnerstyle: {
        enum: ['translation', 'front', 'behind']
      },
      autorefresh: {
        enum: ['false', 'true']
      },
      translationwithcontent: {
        enum: ['false', 'true']
      }
    },
    events: ['move'],
    parents: ['refresh2']
  },
  'refresh-footer': {
    attrs: {
      dragrate: {
        def: 300
      },
      triggerratio: {
        def: 300
      },
      tiggersize: {
        def: 300
      },
      maxdragratio: {
        def: 300
      },
      maxdragdize: {
        def: 300
      },
      refreshdisplayratio: {
        def: 300
      },
      refreshdisplaysize: {
        def: 300
      },
      spinnerstyle: {
        enum: ['translation', 'front', 'behind']
      },
      autorefresh: {
        enum: ['false', 'true']
      },
      translationwithcontent: {
        enum: ['true', 'false']
      }
    },
    events: ['move'],
    parents: ['refresh2']
  },
  ad: {
    attrs: {
      unitid: {
        def: ''
      },
      type: {
        def: 'native'
      },
      adid: {}
    },
    events: ['adclick', 'error']
  },
  'ad-clickable-area': {
    supportCard: true,
    textContent: true,
    atomic: true,
    attrs: {
      type: {}
    }
  },
  'ad-custom': {
    attrs: {
      adUnitId: {},
      channel: {},
      extendCommon: false // 不支持通用属性
    },
    events: ['load', 'error', 'show', 'click', 'close']
  },
  swiper: {
    attrs: {
      index: {
        def: 0
      },
      autoplay: {
        enum: ['false', 'true']
      },
      interval: {
        def: 3000
      },
      indicator: {
        enum: ['true', 'false']
      },
      loop: {
        enum: ['true', 'false']
      },
      duration: {},
      vertical: {
        enum: ['false', 'true']
      },
      previousmargin: {
        def: '0px'
      },
      nextmargin: {
        def: '0px'
      },
      enableswipe: {
        enum: ['true', 'false']
      }
    },
    events: ['change']
  },
  progress: {
    supportCard: true,
    selfClosing: true,
    atomic: true,
    attrs: {
      percent: {
        def: 0
      },
      type: {
        enum: ['horizontal', 'circular']
      }
    }
  },
  picker: {
    supportCard: true,
    selfClosing: true,
    atomic: true,
    attrs: {
      type: {
        required: true,
        enum: ['text', 'date', 'time', 'multi-text']
      },
      start: {
        def: '1970-1-1'
      },
      end: {
        def: '2100-12-31'
      },
      range: {},
      selected: {},
      value: {}
    },
    events: ['change', 'columnchange', 'cancel']
  },
  switch: {
    supportCard: true,
    selfClosing: true,
    atomic: true,
    attrs: {
      checked: {
        enum: ['false', 'true']
      }
    },
    events: ['change']
  },
  textarea: {
    supportCard: true,
    atomic: true,
    textContent: true,
    attrs: {
      placeholder: {},
      maxlength: {}
    },
    events: ['change', 'selectionchange', 'linechange']
  },
  video: {
    empty: true,
    attrs: {
      src: {},
      muted: {
        enum: ['false', 'true']
      },
      autoplay: {
        enum: ['false', 'true']
      },
      controls: {
        enum: ['true', 'false']
      },
      poster: {},
      orientation: {
        enum: ['landscape', 'portrait']
      },
      titlebar: {
        enum: ['true', 'false']
      },
      title: {},
      playcount: {},
      speed: {
        def: 1
      }
    },
    events: [
      'prepared',
      'start',
      'pause',
      'finish',
      'error',
      'seeking',
      'seeked',
      'timeupdate',
      'fullscreenchange'
    ]
  },
  camera: {
    atomic: true,
    selfClosing: true,
    attrs: {
      deviceposition: {
        enum: ['back', 'front']
      },
      flash: {
        enum: ['auto', 'on', 'off', 'torch']
      },
      framesize: {
        enum: ['low', 'normal', 'high']
      },
      autoexposurelock: {
        enum: ['false', 'true']
      },
      autowhitebalancelock: {
        enum: ['false', 'true']
      }
    },
    events: ['error', 'camerainitdone', 'cameraframe']
  },
  map: {
    children: ['custommarker'],
    attrs: {
      latitude: {},
      longitude: {},
      coordtype: {},
      scale: {
        def: 0
      },
      rotate: {
        def: 0
      },
      markers: {},
      showmylocation: {
        enum: ['true', 'false']
      },
      polylines: {},
      polygons: {},
      circles: {},
      controls: {},
      groundoverlays: {},
      includepoints: {},
      heatmaplayer: {},
      showcompass: {
        enum: ['true', 'false']
      },
      enableoverlooking: {
        enum: ['false', 'true']
      },
      enablezoom: {
        enum: ['true', 'false']
      },
      enablescroll: {
        enum: ['true', 'false']
      },
      enablerotate: {
        enum: ['true', 'false']
      },
      showscale: {
        enum: ['false', 'true']
      },
      showzoom: {
        enum: ['false', 'true']
      }
    },
    events: ['loaded', 'regionchange', 'tap', 'markertap', 'callouttap', 'controltap', 'poitap']
  },
  custommarker: {
    parents: ['map'],
    attrs: {
      custommarkerattr: {}
    }
  },
  canvas: {
    atomic: true
  },
  stack: {
    supportCard: true,
    events: ['fullscreenchange']
  },
  richtext: {
    textContent: true,
    atomic: true,
    attrs: {
      type: {
        required: true,
        enum: ['html'].concat(richtextType)
      },
      scene: {}
    },
    events: ['start', 'complete', 'pagechanged', 'splitpage']
  },
  tabs: {
    children: ['tab-bar', 'tab-content'],
    attrs: {
      index: {
        def: 0
      }
    },
    events: ['change']
  },
  'tab-content': {
    parents: ['tabs'],
    attrs: {
      scrollable: {
        enum: ['true', 'false']
      }
    }
  },
  'tab-bar': {
    parents: ['tabs'],
    attrs: {
      mode: {
        enum: ['fixed', 'scrollable']
      }
    }
  },
  popup: {
    supportCard: true,
    children: ['text'],
    attrs: {
      target: {
        required: true
      },
      placement: {
        enum: [
          'left',
          'top',
          'right',
          'bottom',
          'topLeft',
          'topRight',
          'bottomLeft',
          'bottomRight'
        ],
        def: 'bottom'
      }
    },
    events: ['visibilitychange']
  },
  rating: {
    supportCard: true,
    atomic: true,
    attrs: {
      numstars: {
        def: '5'
      },
      rating: {
        def: '0'
      },
      stepsize: {
        def: '0.5'
      },
      indicator: {
        enum: ['false', 'true']
      }
    },
    events: ['change']
  },
  select: {
    supportCard: true,
    children: ['option'],
    events: ['change'],
    excludeRoot: true
  },
  option: {
    supportCard: true,
    parents: ['select'],
    atomic: true,
    textContent: true,
    attrs: {
      selected: {
        def: false
      },
      value: {}
    },
    excludeRoot: true
  },
  marquee: {
    supportCard: true,
    textContent: true,
    atomic: true,
    attrs: {
      scrollamount: {
        def: 6
      },
      loop: {
        def: -1
      },
      direction: {
        enum: ['left', 'right']
      },
      value: {
        def: '6px'
      }
    },
    events: ['bounce', 'finish', 'start']
  },
  scrollview: {
    attrs: {
      'scroll-direction': {
        enum: ['vertical', 'horizontal', 'vertical_horizontal']
      },
      'show-scrollbar': {
        enum: ['true', 'false']
      }
    },
    events: ['scroll', 'scrollbegindrag', 'scrollenddrag', 'scrollstart', 'scrollstop']
  },
  drawer: {
    attrs: {
      enableswipe: {
        enum: ['true', 'false']
      }
    },
    events: ['change', 'scroll']
  },
  lottie: {
    empty: true,
    attrs: {
      source: {
        required: true
      },
      progress: {},
      speed: {},
      loop: {
        enum: [true, false]
      },
      autoplay: {
        enum: [false, true]
      },
      rendermode: {
        enum: [`AUTOMATIC`, `HARDWARE`, `SOFTWARE`]
      }
    },
    events: ['complete', 'error', 'change']
  },
  'drawer-navigation': {
    parents: ['drawer'],
    attrs: {
      direction: {
        enum: ['start', 'end']
      }
    }
  },
  'slide-view': {
    attrs: {
      edge: {
        enum: ['right', 'left']
      },
      enableslide: {
        enum: ['true', 'false']
      },
      isopen: {
        enum: ['false', 'true']
      },
      layer: {
        enum: ['above', 'same']
      },
      buttons: {}
    },
    events: ['open', 'close', 'slide', 'buttonclick']
  },
  'section-list': {
    children: ['section-group', 'section-item'],
    events: ['scroll', 'scrollend', 'scrolltouchup', 'scrolltop', 'scrollbottom']
  },
  'section-group': {
    children: ['section-group', 'section-item', 'section-header'],
    attrs: {
      expand: {
        enum: ['false', 'true']
      }
    },
    events: ['change']
  },
  'section-header': {
    parents: ['section-group']
  },
  'section-item': {},
  'share-button': {
    empty: true,
    attrs: {
      value: {},
      title: {},
      description: {},
      icon: {},
      url: {},
      path: {},
      params: {},
      platforms: {},
      usepageparams: {
        enum: ['true', 'false'],
        def: 'false'
      }
    },
    events: ['success', 'fail', 'cancel']
  },
  'shortcut-button': {
    empty: true,
    attrs: {
      value: {}
    }
  }
}

// 保留标签
const tagReserved = {}
// 自定义组件标签名
let tagComponents = []
// 支持的组件列表
const tagNativeKeys = Object.keys(tagNatives)
// 标签别名
const tagAliasMap = {}
// 标签属性
const tagAttrMap = {}
const tagEnumAttrMap = {}
const tagDefaultAttrMap = {}
const tagRequireAttrMap = {}
// 原子标签（允许子组件有text子组件）
const tagAtomics = {}
// 空元素标签
// 不允许有子组件，也不允许标签间嵌套文字
// 因为没有子组件了，所以他们也允许写成自闭合标签
const tagEmpty = {}
// 带文本内容的标签
const tagTextContent = {}
// 允许子节点
const tagChildrenMap = {}
// 只允许出现一次的子节点
const tagOnceChildrenMap = {}
// 允许父节点
const tagParentsMap = {}
// 允许事件
const tagEventsMap = {}
// 不能作为根节点
const tagNotRoot = []
;(function initRules() {
  tagNativeKeys.forEach(function (tagName) {
    tagReserved[tagName] = true

    const tagInfo = tagNatives[tagName]
    if (tagInfo.atomic) {
      tagAtomics[tagName] = true
    }
    if (tagInfo.textContent) {
      tagTextContent[tagName] = true
    }
    if (tagInfo.empty) {
      tagEmpty[tagName] = true
    }
    if (tagInfo.alias && tagInfo.alias.length) {
      tagInfo.alias.forEach(function (n) {
        tagAliasMap[n] = tagName
      })
    }
    if (tagInfo.excludeRoot === true) {
      tagNotRoot[tagName] = true
    }

    // 处理属性
    let attrsMap = extend({}, tagInfo.attrs)
    const enumAttr = {}
    const defaultAttr = {}
    const requireAttr = []
    // 合并标签的通用属性
    if (!(tagInfo.attrs && tagInfo.attrs.extendCommon === false)) {
      attrsMap = extend(attrsMap, tagCommon.attrs)
    }
    // 从属性中去除通用属性标志位
    if ('extendCommon' in attrsMap) {
      delete attrsMap.extendCommon
    }
    Object.keys(attrsMap).forEach(function (name) {
      const attr = attrsMap[name]
      if (attr.enum && attr.enum.length > 0) {
        enumAttr[name] = attr.enum
        defaultAttr[name] = attr.enum[0]
      }
      if (attr.def) {
        defaultAttr[name] = attr.def
      }
      if (attr.required === true) {
        requireAttr.push(name)
      }
    })
    tagAttrMap[tagName] = attrsMap
    tagEnumAttrMap[tagName] = enumAttr
    tagDefaultAttrMap[tagName] = defaultAttr
    tagRequireAttrMap[tagName] = requireAttr

    // 处理子节点
    tagChildrenMap[tagName] = tagInfo.children
      ? merge([], tagCommon.children, tagInfo.children)
      : null
    tagOnceChildrenMap[tagName] = tagInfo.onceChildren ? merge([], tagInfo.onceChildren) : null
    // 处理父节点
    tagParentsMap[tagName] = tagInfo.parents ? merge([], tagCommon.parents, tagInfo.parents) : null

    // 处理事件
    tagEventsMap[tagName] = merge([], tagCommon.events, tagInfo.events)
  })
})()

/**
 * 检查标签名
 * @param {Object} node - 页面template模块的编译后的树对象
 * @param {Object} output
 * @param {Object} output.result - 结果收集
 * @param {Array} output.log - 日志收集
 * @param {Object} options
 * @param {String} options.uxType - 文件类型
 * @param {String} options.filePath - 当前执行文件的绝对路径
 * @param {Array} options.importNames - 页面引入的自定义组件的name
 */
function checkTagName(node, output, options = {}) {
  const result = output.result
  const log = output.log
  const type = path.extname(options.filePath)

  let tagName = node.tagName
  const childNodes = node.childNodes || []
  const location = node.__location || {}
  // 获取自定义组件名
  tagComponents = options.importNames || []
  // 是否是自定义组件
  const isCustomTag = tagComponents.includes(tagName)

  // 处理别名
  if (!isCustomTag && tagAliasMap[tagName]) {
    if (tagName !== 'img') {
      // `parse5`自动将image转换为img
      log.push({
        line: location.line || 1,
        column: location.col || 1,
        reason: 'NOTE: 组件名 `' + tagName + '` 自动转换为 `' + tagAliasMap[tagName] + '`'
      })
    }
    tagName = tagAliasMap[tagName]
  }

  // 如果是组件标签
  result.type = tagName
  if (RESERVED_TAGS.indexOf(tagName) >= 0) {
    log.push({
      line: location.line || 1,
      column: location.col || 1,
      reason: 'ERROR: 组件名 `' + tagName + '` 是系统保留的组件名, 请修改'
    })
  } else if (!hasTagDefined(tagName)) {
    log.push({
      line: location.line || 1,
      column: location.col || 1,
      reason: `WARN: 未识别的标签名 '${tagName}'，如果是自定义组件，请确认已经引入`
    })
  }

  if (
    options.uxType === ENTRY_TYPE.CARD &&
    tagNatives[tagName] &&
    !tagNatives[tagName].supportCard
  ) {
    log.push({
      line: location.line || 1,
      column: location.col || 1,
      reason: 'ERROR: 卡片不支持组件名 `' + tagName + '`, 请修改'
    })
  }

  // 检测根组件合法性
  if (node._isroot && tagNotRoot.hasOwnProperty(tagName)) {
    log.push({
      line: location.line || 1,
      column: location.col || 1,
      reason: 'ERROR: 组件 `' + tagName + '` 不能作为根组件'
    })
  }
  // 检测非文本组件是否包含文本

  // attr为空时，设置返回的attr的默认值
  result.attr = result.attr || {}
  // 处理必需属性
  const attrs = node.attrs || []
  // 标签的属性列表
  const attrlist = []
  // 转换为小写
  attrs.forEach(function (item) {
    attrlist.push(item.name.toLowerCase())
  })

  // 检查根节点属性合法性
  if (node._isroot) {
    const rootExcludeAttrList = ['for', 'if', 'elif', 'else', 'show']
    attrlist.forEach((name) => {
      if (rootExcludeAttrList.indexOf(name) >= 0) {
        log.push({
          line: location.line || 1,
          column: location.col || 1,
          reason: 'WARN: 根节点 `' + tagName + '` 不能使用属性 `' + name + '`'
        })
      }
    })
  }

  // 如果是自定义组件，系统组件的规则都不需要校验了
  if (isCustomTag) return

  // 空组件标签，不允许有子元素
  if (tagEmpty.hasOwnProperty(tagName)) {
    if (childNodes.length > 0) {
      log.push({
        line: location.line || 1,
        column: location.col || 1,
        reason: 'ERROR: 组件 `' + tagName + '` 内不能有子节点与文字，请修改'
      })
    }
  }

  // 如果是原子标签
  // 因为ad-clickable-area组件既可以支持文本，又可以支持子组件，所以不做检查
  if (tagAtomics.hasOwnProperty(tagName) && tagName !== 'ad-clickable-area') {
    // 如果没有文本内容
    if (tagTextContent.hasOwnProperty(tagName)) {
      // 非文本节点
      if (childNodes.length > 0) {
        // 不处理#text子节点
        childNodes.every((child) => {
          if (child.nodeName !== '#text') {
            log.push({
              line: location.line || 1,
              column: location.col || 1,
              reason: 'ERROR: 组件 `' + tagName + '` 是原子类型，不应该有子节点'
            })
            return false
          }
          return true
        })
      }
    } else {
      // 文本节点
      if (childNodes.length > 1 || (childNodes[0] && childNodes[0].nodeName !== '#text')) {
        // 只能是文本内容，否则报错
        log.push({
          line: location.line || 1,
          column: location.col || 1,
          reason: 'ERROR: 组件 `' + tagName + '` 只能有一个文字子节点'
        })
      }
    }
  }

  // 处理缺省属性(如果值为空, 则设置为缺省值)
  if (tagDefaultAttrMap[tagName]) {
    Object.keys(tagDefaultAttrMap[tagName]).forEach((name) => {
      const index = attrlist.indexOf(name)
      if (index >= 0 && attrs[index].value === '') {
        attrs[index].value = tagDefaultAttrMap[tagName][name]
        log.push({
          line: location.line || 1,
          column: location.col || 1,
          reason:
            'ERROR: 组件 `' +
            tagName +
            '` 属性 `' +
            name +
            '` 值为空, 默认设置为缺省值 `' +
            tagDefaultAttrMap[tagName][name] +
            '`'
        })
      } else if (tagName === 'slot' && index < 0) {
        node.attrs.push({
          name,
          value: tagDefaultAttrMap[tagName][name]
        })
        colorconsole.warn(
          `标签 ${tagName} 的属性 \`${name}\` 值为空, 默认设置为缺省值 \`${
            tagDefaultAttrMap[tagName][name]
          }\` ${options.filePath} @${location.line || 1},${location.col || 1}`
        )
      }
    })
  }

  // 检查必需的属性
  if (tagRequireAttrMap[tagName]) {
    tagRequireAttrMap[tagName].forEach((name) => {
      if (attrlist.indexOf(name) < 0) {
        log.push({
          line: location.line || 1,
          column: location.col || 1,
          reason: 'ERROR: 组件 `' + tagName + '` 没有定义属性 `' + name + '`'
        })
      }
    })
  }

  // 检查属性枚举值的合法性
  if (tagEnumAttrMap[tagName]) {
    Object.keys(tagEnumAttrMap[tagName]).forEach((name) => {
      const index = attrlist.indexOf(name)
      if (index >= 0) {
        const value = attrs[index].value
        if (!exp.isExpr(value)) {
          // 如果是表达式，则跳过检测
          const enums = tagEnumAttrMap[tagName][name]
          if (enums.indexOf(value) < 0) {
            attrs[index].value = enums[0]
            log.push({
              line: location.line || 1,
              column: location.col || 1,
              reason:
                'ERROR: 组件 `' +
                tagName +
                '` 属性 `' +
                name +
                '` 的值 `' +
                value +
                '`非法, 默认设置为缺省值 `' +
                enums[0] +
                '`'
            })
          }
        }
      }
    })
  }

  // 检查属性的合法性
  if (tagAttrMap[tagName] && tagName !== 'component') {
    attrlist.forEach((item) => {
      if (!item.match(/^(on|@)/)) {
        // 对vue的属性检测适配
        if (type.indexOf(extList[2]) >= -1) {
          if (/^(:|v-|key|ref|is|slot|slot-scope)/.test(item)) return
        }
        // model指令等拓展指令跳过检测
        if (RESERVED_DIRECTIVES.test(item)) return
        const isDataAttr = checkDataAttr(item)
        const isTagAttr = Object.prototype.hasOwnProperty.call(tagAttrMap[tagName], item)
        // 避开事件和自定义属性(data-*),校验属性值
        if (!(isDataAttr || isTagAttr)) {
          log.push({
            line: location.line || 1,
            column: location.col || 1,
            reason: 'WARN: 组件 `' + tagName + '` 不支持属性 `' + item
          })
        }
      }
    })
  }

  // 检查事件合法性
  if (tagEventsMap[tagName] && tagName !== 'component') {
    const events = tagEventsMap[tagName]
    attrlist.forEach((name) => {
      if (name.match(/^(on|@)/)) {
        const eventName = name.replace(/^(on|@)/, '')
        // 对卡片不支持的事件进行判断
        const cardEventBlackList = ['appear', 'disappear', 'swipe']
        if (
          options.uxType === ENTRY_TYPE.CARD &&
          cardEventBlackList.indexOf(eventName.toLowerCase()) > -1
        ) {
          log.push({
            line: location.line || 1,
            column: location.col || 1,
            reason: 'ERROR: 卡片组件 `' + tagName + '` 不支持事件 `' + eventName + '`'
          })
        }
        if (events.indexOf(eventName.toLowerCase()) < 0) {
          log.push({
            line: location.line || 1,
            column: location.col || 1,
            reason: 'ERROR: 组件 `' + tagName + '` 不支持事件 `' + eventName + '`'
          })
        }
      }
    })
  }

  // 检查子组件合法性
  if (childNodes.length > 0) {
    const slotSet = new Set()
    const nodeNameMap = {}
    childNodes.forEach((child, index) => {
      // 只有父组件和子组件均为保留标签时，才需要检测合法性
      if (isReservedTag(tagName) && isReservedTag(child.nodeName)) {
        const tagParents = tagParentsMap[child.nodeName]
        const tagChildren = tagChildrenMap[tagName]
        const tagOnceChildren = tagOnceChildrenMap[tagName]
        if (child.nodeName === 'slot') {
          let currentNode = child.parentNode
          while (currentNode) {
            if (currentNode.tagName === 'slot') {
              colorconsole.warn(
                `slot标签内不应该嵌套slot ${options.filePath}@${location.line || 1},${
                  location.col || 1
                }`
              )
              break
            }
            currentNode = currentNode.parentNode
          }
          const attrsMap = {}
          child.attrs.map((item) => {
            attrsMap[item.name] = item.value
          })
          if (!attrsMap.hasOwnProperty('name')) {
            attrsMap.name = 'default'
          } else if (/\{\{\s*[\w$]+\s*\}\}/.test(attrsMap.name)) {
            colorconsole.warn(
              `标签${child.nodeName}的name属性暂时不支持动态绑定 ${options.filePath}@${
                location.line || 1
              },${location.col || 1}`
            )
          }

          if (slotSet.has(attrsMap.name)) {
            colorconsole.warn(
              `标签${tagName}内存在name为 \`${attrsMap.name}\` 重复slot ${options.filePath}@${
                location.line || 1
              },${location.col || 1}`
            )
          } else {
            slotSet.add(attrsMap.name)
          }
        }
        // 若子组件有parents属性，检查tagName是否为子组件合法的父组件；若父组件有children属性，检查child.nodeName是否为父组件合法的子组件
        // 此处 if 条件不修改: 默认不包含在 tagOnceChildrenMap[child.nodeName] 中的组件也允许作为 tagName 组件的子组件
        if (
          (tagParents && tagParents.indexOf(tagName) < 0) ||
          (tagChildren && tagChildren.indexOf(child.nodeName) < 0)
        ) {
          log.push({
            line: location.line || 1,
            column: location.col || 1,
            reason: 'ERROR: 组件 `' + tagName + '` 不支持子组件 `' + child.nodeName + '`'
          })
        } else if (tagOnceChildren && tagOnceChildren.indexOf(child.nodeName) > -1) {
          let duplicated
          if (nodeNameMap[child.nodeName] || nodeNameMap[child.nodeName] === 0) {
            duplicated = true
          }
          // 对于只允许出现一次的子节点，保留最后一个的索引
          nodeNameMap[child.nodeName] = {
            index,
            duplicated
          }
        }
      }
    })
    const keys = Object.keys(nodeNameMap)
    if (keys.length) {
      keys
        .filter((childName) => nodeNameMap[childName].duplicated)
        .forEach((childName) => {
          log.push({
            line: location.line || 1,
            column: location.col || 1,
            reason: `'WARN: 组件 \`${childName}\` 只允许在 \`${tagName}\` 组件中出现一次`
          })
        })
      node.childNodes = childNodes.filter(
        (child, index) =>
          !(
            nodeNameMap[child.nodeName] &&
            nodeNameMap[child.nodeName].duplicated &&
            index !== nodeNameMap[child.nodeName].index
          )
      )
    }
  }

  // 检查是否漏写了结束标签(仅针对不支持自闭合的标签，如 <div>)
  if (!isSupportedSelfClosing(tagName) && location.startTag && !location.endTag) {
    log.push({
      line: location.line || 1,
      column: location.col || 1,
      reason: 'ERROR: 组件 `' + tagName + '` 缺少闭合标签，请检查'
    })
  }

  // 检查 list-item 内是否使用了指令 if 或者 for
  if (tagName === 'list-item' && hasIfOrFor(childNodes)) {
    log.push({
      line: location.line || 1,
      column: location.col || 1,
      reason:
        'WARN: `list-item` 内部需谨慎使用指令 if 或 for，相同 type 属性的 list-item， DOM 结构必须完全相同`'
    })
  }
}

/**
 * 检测Id属性
 * @param id
 * @param output
 */
function checkId(id, output) {
  if (id) {
    const isLite = output.isLite
    const isNewJSCard = output.isNewJSCard
    output.result.id = exp.isExpr(id) ? exp(id, true, isLite, isNewJSCard) : id
    if (isNewJSCard) {
      output.result.idRaw = id
    }
  }
}

/**
 * 判断自定义(data-*)属性
 * @param attrName
 * @returns {boolean}
 */
function checkDataAttr(attrName) {
  return REG_TAG_DATA_ATTR.test(attrName)
}

/**
 * 检测构造模式
 * @param id
 * @param output
 */
function checkBuild(mode, output) {
  if (mode) {
    output.result.append = mode === 'tree' ? 'tree' : 'single'
  }
}

/**
 * 检测class属性
 * 'a b c' -> ['a', 'b', 'c']
 * 'a {{b}} c' -> function () {return ['a', this.b, 'c']}
 * @param className
 * @param output
 */
function checkClass(className, output) {
  let hasBinding
  let classList = []

  className = className.trim()
  const isLite = output.isLite
  const isNewJSCard = output.isNewJSCard
  if (className) {
    let start = 0
    let end = 0
    const segs = []
    const matched = className.match(REG_CLASS_VALUE)
    if (matched) {
      let staticString
      // 拆解 class 属性，将静态 class 和插值表达式分离
      matched.forEach((exp) => {
        end = className.indexOf(exp, start)
        staticString = className.slice(start, end)
        if (staticString.length) {
          segs.push(staticString)
        }
        segs.push(exp)
        start += staticString.length + exp.length
      })
    }
    segs.push(className.slice(start)) // trailing static classes

    classList = segs.reduce((list, seg) => {
      if (exp.isExpr(seg)) {
        hasBinding = true
        list.push(exp(seg, false, isLite))
        return list
      }
      return list.concat(
        seg
          .split(/\s+/g)
          .filter((s) => s)
          .map((s) => (isLite ? s : `'${s}'`))
      )
    }, [])
    classList = classList.filter((klass) => klass.trim())

    if (isLite) {
      if (!isValidClassArray(segs)) {
        const err = new Error('轻卡 class 样式不支持动态数据绑定 {{}} 和静态样式混用')
        err.isExpressionError = true
        err.expression = className
        throw err
      }
      output.result.classList = classList
    } else if (hasBinding) {
      try {
        let code = ''
        if (isNewJSCard) {
          code = 'function () {return [' + classList.join(', ') + ']}'
          output.result.classList = code
        } else {
          code = '(function () {return [' + classList.join(', ') + ']})'
          /* eslint-disable no-eval */
          output.result.classList = eval(code)
          /* eslint-enable no-eval */
        }
      } catch (err) {
        err.isExpressionError = true
        err.expression = className
        throw err
      }
    } else {
      output.result.classList = classList.map(
        // 去掉引号
        (klass) => klass.slice(1, -1)
      )
    }
  }
  if (isNewJSCard) {
    output.result.class = className
    output.result.classListRaw = className
  }
}

/**
 * 检查样式
 * '{{a}}' -->  function () { return this.a; }
 * 'b:{{v}};' --> {b: function() { return this.v; }}
 * @param cssText
 * @param output
 * @param locationInfo
 */
function checkStyle(cssText, output, locationInfo, options) {
  let style = {}
  let styleRaw = {}
  const log = output.log
  if (cssText) {
    const isLite = output.isLite
    const isNewJSCard = output.isNewJSCard
    if (exp.singleExpr(cssText)) {
      // 检测是否嵌套{{}}
      const incText = exp.removeExprffix(cssText)
      if (exp.isExpr(incText)) {
        log.push({
          line: locationInfo.line || 1,
          column: locationInfo.col || 1,
          reason: 'ERROR: style 属性不能嵌套多层{{}}'
        })
      } else {
        style = exp(cssText, true, isLite, isNewJSCard)
      }
      output.result.style = style
      if (isNewJSCard) {
        output.result.styleRaw = cssText
      }
      return
    }
    // 如果是 a: {{}}; b: {{}};, 则分解处理
    cssText.split(';').forEach(function (declarationText) {
      let k, v, vResult
      let pair = declarationText.trim().split(':')
      // 如果出现xxx:xxx:xxx的情况, 则将第一个:之后文本作为value
      if (pair.length > 2) {
        pair[1] = pair.slice(1).join(':')
        pair = pair.slice(0, 2)
      }
      if (pair.length === 2) {
        k = pair[0].trim()
        k = hyphenedToCamelCase(k)
        v = pair[1].trim()

        const valueRaw = v
        v = exp(v, true, isLite, isNewJSCard) // 处理值表达式
        vResult = styler.validateDelaration(k, v, options)
        v = vResult.value
        v.forEach((t) => {
          // 如果校验成功，则保存转换后的属性值
          if (isValidValue(t.v) || typeof t.v === 'function') {
            style[t.n] = t.v
            if (isNewJSCard) {
              styleRaw[t.n] = valueRaw
            }
          }
        })
        if (vResult.log) {
          log.push({
            line: locationInfo.line || 1,
            column: locationInfo.col || 1,
            reason: vResult.log.reason
          })
        }
      }
    })
    if (typeof style === 'object') {
      for (let key in style) {
        if (styler.shouldAddToDependency(key, style[key])) {
          // 内联样式中的静态资源引用
          output.depFiles.push(style[key])
        }
      }
    }
    output.result.style = style
    if (isNewJSCard) {
      output.result.styleRaw = styleRaw
    }
  }
}

/**
 * 检查if语句
 * @param value
 * @param output
 * @param not 是否取反
 */
function checkIs(value, output, locationInfo) {
  const log = output.log
  if (value) {
    // 如果没有，补充上{{}}
    value = exp.addExprffix(value)
    const isLite = output.isLite
    const isNewJSCard = output.isNewJSCard

    // 将表达式转换为function
    output.result.is = exp(value, true, isLite, isNewJSCard)
    if (isNewJSCard) {
      output.result.isRaw = value
    }
  } else {
    log.push({
      line: locationInfo.line || 1,
      column: locationInfo.col || 1,
      reason: 'WARN: is 属性为空'
    })
  }
}

/**
 * 检查if语句
 * @param value
 * @param output
 * @param not 是否取反
 */
function checkIf(value, output, not, locationInfo, conditionList) {
  const log = output.log
  if (value) {
    // 如果没有，补充上{{}}
    value = exp.addExprffix(value)
    const isLite = output.isLite
    const isNewJSCard = output.isNewJSCard
    if (not) {
      value = '{{' + buildConditionExp(conditionList) + '}}'
    } else {
      // if动作前需要清除conditionList之前的结构
      conditionList.length > 0 && (conditionList.length = 0)
      conditionList.push(`${value.substr(2, value.length - 4)}`)
    }
    // 将表达式转换为function
    output.result.shown = isLite ? value : exp(value, true, isLite, isNewJSCard)
    if (isNewJSCard) {
      output.result.shownRaw = value
    }
  } else {
    if (!not) {
      log.push({
        line: locationInfo.line || 1,
        column: locationInfo.col || 1,
        reason: 'WARN: if 属性为空'
      })
    }
  }
}

/**
 * 检查else语句
 * @param value
 * @param output
 * @param not
 */
function checkElse(value, output, locationInfo, conditionList) {
  checkIf(value, output, true, locationInfo, conditionList)
  // else动作之后需清除conditionList之前的结构
  conditionList.length = 0
}

/**
 * 检查else if语句
 * @param value
 * @param output
 * @param not
 */
function checkElif(value, cond, output, locationInfo, conditionList) {
  const log = output.log
  let newcond = cond
  if (value) {
    // 如果没有，补充上{{}}
    value = exp.addExprffix(value)
    cond = exp.addExprffix(cond)
    const isLite = output.isLite
    const isNewJSCard = output.isNewJSCard
    newcond =
      '{{(' + value.substr(2, value.length - 4) + ') && ' + buildConditionExp(conditionList) + '}}'

    // 将表达式转换为function
    output.result.shown = isLite ? newcond : exp(newcond, true, isLite, isNewJSCard)
    if (isNewJSCard) {
      output.result.shownRaw = newcond
    }
    conditionList.push(`${value.substr(2, value.length - 4)}`)
  } else {
    log.push({
      line: locationInfo.line || 1,
      column: locationInfo.col || 1,
      reason: 'WARN: Elif 属性为空'
    })
  }
  return newcond
}

/**
 * 检查循环
 * @param value
 * @param output
 */
function checkFor(value, output, locationInfo) {
  const log = output.log
  if (value) {
    // 如果是单一表达式，去除{{}}
    value = exp.removeExprffix(value)

    // 如果是'key in values'的形式
    let key
    let val
    const inMatch = value.match(/(.*) (?:in) (.*)/)
    if (inMatch) {
      // 如果key是以'(key,value)'格式
      const itMatch = inMatch[1].match(/\((.*),(.*)\)/)
      if (itMatch) {
        key = itMatch[1].trim()
        val = itMatch[2].trim()
      } else {
        val = inMatch[1].trim()
      }
      value = inMatch[2]
    }
    value = '{{' + value + '}}'

    const isLite = output.isLite
    const isNewJSCard = output.isNewJSCard
    let repeat, repeatRaw
    if (!key && !val) {
      repeat = exp(value, true, isLite, isNewJSCard)
      repeatRaw = value
    } else {
      // 如果指定key,value
      repeat = { exp: exp(value, true, isLite, isNewJSCard) }
      repeatRaw = { expRaw: value }
      if (key) {
        repeat.key = key
      }
      if (val) {
        repeat.value = val
      }
    }
    output.result.repeat = repeat
    if (isNewJSCard) {
      output.result.repeatRaw = repeatRaw
    }
  } else {
    log.push({
      line: locationInfo.line || 1,
      column: locationInfo.col || 1,
      reason: 'WARN: for 属性为空'
    })
  }
}

/**
 * 检查事件属性
 * @param  {string} name  事件名以on开头
 * @param  {string} value
 * @param  {object} output{result, deps[], log[]}
 */
function checkEvent(name, value, output) {
  const originValue = value
  // 去除开头的'on'
  const eventName = name.replace(/^(on|@)/, '')
  if (eventName && value) {
    // 去除表达式的{{}}
    value = exp.removeExprffix(value)

    // 如果表达式形式为XXX(xxxx)
    const paramsMatch = value.match(/(.*)\((.*)\)/)
    if (paramsMatch) {
      if (output.isLite) {
        const err = new Error('轻卡不支持带参数的事件')
        err.isExpressionError = true
        err.expression = value
        throw err
      }
      const funcName = paramsMatch[1]
      let params = paramsMatch[2]
      // 解析','分隔的参数
      if (params) {
        params = params.split(/\s*,\s*/)
        // 如果参数中没有'$evt',则自动在末尾添加'$evt'
        if (params.indexOf('evt') === -1) {
          params[params.length] = 'evt'
        }
      } else {
        // 否则默认有一个参数'$evt'
        params = ['evt']
      }
      value = '{{' + funcName + '(' + params.join(',') + ')}}'
      try {
        // 将事件转换为函数对象
        if (output.isNewJSCard) {
          value = 'function (evt) { return ' + exp(value, false).replace('this.evt', 'evt') + '}'
        } else {
          /* eslint-disable no-eval */
          value = eval(
            '(function (evt) { return ' + exp(value, false).replace('this.evt', 'evt') + '})'
          )
          /* eslint-enable no-eval */
        }
      } catch (err) {
        err.isExpressionError = true
        err.expression = originValue
        throw err
      }
    }
    output.result.events = output.result.events || {}
    output.result.events[eventName] = value
  }
}

/**
 * @param  {string} name
 * @param  {string} value
 * @param  {object} output{result, deps[], log[]}
 * @param {Object} node - 页面template模块的编译后的树对象
 */
function checkCustomDirective(name, value, output, node) {
  const dirName = name.replace(/^dir:/, '')

  // 自定义指令格式校验
  if (!dirName) {
    colorconsole.warn(`\`${node.tagName}\` 组件自定义指令名称不能为空`)
    return false
  }
  const isNewJSCard = output.isNewJSCard
  output.result.directives = output.result.directives || []
  if (isNewJSCard) {
    // 补全绑定值的双花括号，如：dir:指令名称="data"补全为dir:指令名称="{{data}}"
    value = exp.addExprffix(value)

    output.result.directives.push({
      name: dirName,
      value: exp.isExpr(value) ? exp(value, true, output.isLite, output.isNewJSCard) : value,
      valueRaw: value
    })
  } else {
    output.result.directives.push({
      name: dirName,
      value: exp.isExpr(value) ? exp(value, true, output.isLite, output.isNewJSCard) : value
    })
  }
}

/**
 * @param  {string} name
 * @param  {string} value
 * @param  {object} output{result, deps[], log[]}
 * @param  {String} tagName
 * @param  {object} locationInfo{line, column}
 * @param  {object} options
 */
function checkAttr(name, value, output, tagName, locationInfo, options) {
  if (name && isValidValue(value)) {
    if (shouldConvertPath(name, value, tagName)) {
      if (!exp.isExpr(value)) {
        // 若路径不包含表达式，判断路径下资源是否存在
        const hasFile = fileExists(value, options.filePath)
        if (!hasFile) {
          output.log.push({
            line: locationInfo.line,
            column: locationInfo.column,
            reason:
              'WARN: ' + tagName + ' 属性 ' + name + ' 的值 ' + value + ' 下不存在对应的文件资源'
          })
        }
      }
      // 转换为以项目源码为根的绝对路径
      value = resolvePath(value, options.filePath)
      output.depFiles.push(value)
    }
    const isLite = output.isLite
    const isNewJSCard = output.isNewJSCard
    output.result.attr = output.result.attr || {}
    output.result.attr[hyphenedToCamelCase(name)] = exp(value, true, isLite, isNewJSCard)
    if (isNewJSCard) {
      output.result.attr[hyphenedToCamelCase(name) + 'Raw'] = value
    }
    if (name === 'value' && tagName === 'text') {
      output.log.push({
        line: locationInfo.line,
        column: locationInfo.column,
        reason: 'WARN: `value` 应该写在<text>标签中'
      })
    }
  }
}

/**
 * 是否转换资源引用路径
 * @param name {string} - 属性名
 * @param value {string} - 属性值
 * @param tagName {string} - 标签名
 * @returns {boolean}
 */
function shouldConvertPath(name, value, tagName) {
  const skip = name === 'alt' && value === 'blank'
  if (skip) {
    return false
  }

  if (['src', 'alt'].includes(name) && value && ['img', 'video'].indexOf(tagName) > -1) {
    if (!/^(data:|http|{{)/.test(value)) {
      return true
    }
  }
  return false
}

/**
 * 是否为保留标签
 */
function isReservedTag(tag) {
  return tagReserved.hasOwnProperty(tag)
}

/**
 * 是否为包含text内容的原子组件
 */
function isTextContentAtomic(tag) {
  return tagTextContent.hasOwnProperty(tag) && tagAtomics.hasOwnProperty(tag)
}

/**
 * 非文本标签且非原子组件
 */
function isNotTextContentAtomic(tag) {
  return !tagTextContent.hasOwnProperty(tag) && !tagAtomics.hasOwnProperty(tag)
}

/**
 * 判断标签是否支持span
 * @param tag
 */
function isSupportSpan(tag) {
  if (!tag || typeof tag !== 'string') {
    return
  }
  return tagChildrenMap[tag] && tagChildrenMap[tag].indexOf('span') > -1
}

/**
 * 获取标签支持的子节点
 * @param tag
 * @returns {*|Array}
 */
function getTagChildren(tag) {
  if (!tag || typeof tag !== 'string') {
    return
  }
  return tagChildrenMap[tag] || []
}

/**
 *判断标签是否支持自闭合
 * @param tag
 */
function isSupportedSelfClosing(tag) {
  if (!tag || typeof tag !== 'string') {
    return
  }
  tag = tagAliasMap[tag] || tag
  return tagNatives[tag] && !!tagNatives[tag].selfClosing
}

/**
 * 判断标签名是否支持
 * @param {string} tag - 标签的name
 */
function hasTagDefined(tag) {
  return tagNativeKeys.indexOf(tag) > -1 || tagComponents.indexOf(tag) > -1
}

/**
 * 检查是否为空元素
 * @param {String} tagName - 标签名
 * @returns {Boolean}
 */
function isEmptyElement(tagName) {
  tagName = tagAliasMap[tagName] || tagName
  return tagNatives[tagName] && tagNatives[tagName].empty === true
}

/**
 * 输出条件取反的字符串表示
 * @param list
 * @return {string}
 */
function buildConditionExp(list) {
  return list
    .map((exp) => {
      return `!(${exp})`
    })
    .join(' && ')
}

/**
 * 检查节点中是否含有指令 if 或者 for
 * @param {Array} nodes
 */
function hasIfOrFor(nodes) {
  let flag = false
  nodes.find((item) => {
    const index = (item.attrs || []).findIndex((attr) => {
      return ['for', 'if'].indexOf(attr.name) > -1
    })
    if (index > -1) {
      flag = true
      return flag
    }
    if (Array.isArray(item.childNodes)) {
      flag = hasIfOrFor(item.childNodes)
      return flag
    }
  })
  return flag
}

/**
 * 检查class数组是否为常量和变量混合的方式，如 "clazz1 {{myClass}}"
 */
function isValidClassArray(arr) {
  const filterArr = arr.filter((clazz) => clazz.length > 0)

  let hasTemplateString = false

  for (let i = 0; i < filterArr.length; i++) {
    if (exp.isExpr(filterArr[i])) {
      hasTemplateString = true
      break
    }
  }

  return !hasTemplateString || filterArr.length === 1 // 如果全都为常量 className 或者只有一个变量的className，则返回true
}

export default {
  checkTagName,
  checkId,
  checkClass,
  checkStyle,
  checkIs,
  checkIf,
  checkElse,
  checkElif,
  checkFor,
  checkEvent,
  checkCustomDirective,
  checkAttr,
  checkBuild,
  checkModel,
  isReservedTag,
  isTextContentAtomic,
  isSupportSpan,
  getTagChildren,
  isSupportedSelfClosing,
  isEmptyElement,
  isNotTextContentAtomic,
  isExpr: exp.isExpr,
  parseText: exp.parseText
}
