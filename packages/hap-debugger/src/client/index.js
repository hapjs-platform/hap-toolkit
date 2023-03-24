/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

require('./index.css')
const $ = (selector, elem) => {
  return typeof elem === 'undefined'
    ? document.querySelector(selector)
    : elem.querySelector(selector)
}

function init() {
  const qrImgId = '#j-qr-icon'
  const $qrCodeImg = $(qrImgId)
  const timeStamp = Date.now() % 1e5
  $qrCodeImg.src = `/qrcode?ws_id=${timeStamp}`
  bindEvents()
}

function bindEvents() {
  const socket = io(location.origin) // eslint-disable-line no-undef

  socket.on('appRegistered', (data) => {
    console.info(`on receiving appRegistered message: ${JSON.stringify(data)}`)
    updateTableElement(data)
  })
  socket.on('informUpdate', () => {
    console.info('on receiving informUpdate')
    appendUpdateInfo()
  })
}

/**
 * 更新页面调试信息
 * @param data{ inspectorUrl, application }
 */
function updateTableElement(data) {
  const wrapper = '.inspector-link-panel'
  const tplId = '#j-tpl-appinfo'
  const $panelWrapper = $(wrapper)
  const $tplAppInfoElem = $(tplId)
  const $tbodyElem = $('tbody', $panelWrapper)
  let tplTextContent = $tplAppInfoElem.textContent

  $panelWrapper.classList.add('hide')
  const dataToFill = {
    data_app_name: data.application,
    data_href_value: data.inspectorUrl,
    data_href_name: '进入调试页面'
  }
  Object.keys(dataToFill).forEach((key) => {
    tplTextContent = tplTextContent.replace(`{{${key}}}`, dataToFill[key])
  })

  $tbodyElem.innerHTML = tplTextContent
  $panelWrapper.classList.remove('hide')
}

function appendUpdateInfo() {
  const tplId = '#j-tpl-updatetip'
  const wrapper = '.inform-tip-wrapper'
  const $tplUpdateTipElem = $(tplId)
  const $panelWrapper = $(wrapper)
  $panelWrapper.innerHTML = $tplUpdateTipElem.textContent
}

init()
