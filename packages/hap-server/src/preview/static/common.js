/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

base = typeof base === 'undefined' ? '/preview' : base
const eventsource = new EventSource('/preview/__stream')

// 用以表示页面初始化，还没进行 watch 修改
let isInitial = true

const ProgressBar = (function (){
  class _ProgressBar {
    constructor() {
      this.basicText = {
        'zh': '正在编译中...',
        'en': 'Compiling...',
      }[getLan()]

      const $progressbar = document.createElement('p')
      $progressbar.id = 'progress-bar'
      document.body.appendChild($progressbar)

      $progressbar.style.color = {
        'dark': 'rgba(255, 255, 255, 0.8)',
        'light': 'rgba(0, 0, 0, 0.8)',
      }[getTheme()]

      this.progressbar = $progressbar
    }
    run(percentage) {
      this.progressbar.innerText = this.basicText + parseInt((Number(percentage) * 100).toString()) + '%'
    }
  }
  let instance = null
  return function() {
    if (!instance) {
      instance = new _ProgressBar()
    }
    return instance
  }
})()

function getLan() {
  return window.QUICKAPP_LANGUAGE || 'zh'
}

function getTheme() {
  return window.QUICKAPP_THEME || 'dark'
}

function showError(error) {
  if (typeof $mask === 'undefined') {
    $mask = document.createElement('div')
    $mask.id = 'mask'
    $mask.style.display = 'none'
    document.body.appendChild($mask)

    $btn = document.createElement('div')
    $btn.id = 'btn'
    $btn.innerHTML = '&times;'
    $btn.onclick = function() {
      $mask.style.display = 'none'
    }
    $mask.appendChild($btn)

    $text = document.createElement('pre')
    $text.id = 'text'
    $mask.appendChild($text)
  }
  $text.innerHTML = 'ERROR:\n' + error
  $mask.style.display = 'block'
}

eventsource.addEventListener('watch', page => {
  // webjs 会清空 body 下所有 dom，所以这里要新建
  const $loading = document.createElement('div')
  $loading.id = 'loading'
  $loading .classList.add(getLan(), getTheme())
  document.body.appendChild($loading)
})

eventsource.addEventListener('progress', page => {
  const { percentage } = JSON.parse(page.data)
  // 编译过程到 build 文件就会通知更新预览，即在过程 95% 时刷新
  // 更新后会有剩下 5% 的进度发过来，此时不需要显示进度了
  // 判断是从编译进度 0 开始，才显示进度
  if (isInitial && percentage === 0) {
    isInitial = false
  }
  if (isInitial) {
    return
  }
  const progress = new ProgressBar()
  progress.run(percentage)
})

eventsource.addEventListener('reload', ev => {
  // page.data: 快应用页面router page，空值为默认模式
  window.sessionStorage.removeItem('system.router.params')
  window.sessionStorage.removeItem('routes')
  const data = JSON.parse(ev.data)
  const error = unescape(data.error)
  const path = data.path
  if (error) {
    showError(error)
    return
  }
  if (path) {
    location.replace(`${base}/${path}`)
  } else {
    location.replace(base)
  }
})
eventsource.onerror = function(evt) {
  console.log('EventSource error', evt)
}