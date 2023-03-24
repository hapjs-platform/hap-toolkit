/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// CSS后代选择器全写-缩写对照表
const cssDescSelectorList = [
  {
    newN: 't',
    oldN: 'type',
    newV: ['d', 'a', 't', 'u', 'p', 'pe'],
    oldV: ['descendant', 'attribute', 'tag', 'universal', 'pseudo', 'pseudo-element']
  },
  { newN: 'n', oldN: 'name' },
  { newN: 'i', oldN: 'ignoreCase' },
  { newN: 'a', oldN: 'action' },
  { newN: 'v', oldN: 'value' }
]

// CSS属性名全写-缩写对照表
const cssAttrMap = {
  // boxModel
  width: 'w',
  height: 'h',
  paddingLeft: 'pL',
  paddingRight: 'pR',
  paddingTop: 'pT',
  paddingBottom: 'pB',
  marginLeft: 'mL',
  marginRight: 'mR',
  marginTop: 'mT',
  marginBottom: 'mB',
  borderLeftWidth: 'bLW',
  borderTopWidth: 'bTW',
  borderRightWidth: 'bRW',
  borderBottomWidth: 'bBW',
  borderLeftColor: 'bLC',
  borderTopColor: 'bTC',
  borderRightColor: 'bRC',
  borderBottomColor: 'bBC',
  borderStyle: 'bS',
  borderRadius: 'bR',
  borderBottomLeftRadius: 'bBLR',
  borderBottomRightRadius: 'bBRR',
  borderTopLeftRadius: 'bTLR',
  borderTopRightRadius: 'bTRR',
  indicatorSize: 'iS',
  // flexbox
  flex: 'f',
  flexGrow: 'fG',
  flexShrink: 'fS',
  flexBasis: 'fB',
  flexDirection: 'fD',
  flexWrap: 'fW',
  justifyContent: 'jC',
  alignItems: 'aI',
  alignContent: 'aC',
  alignSelf: 'aS',
  // position
  position: 'p',
  top: 't',
  bottom: 'b',
  left: 'l',
  right: 'r',
  zIndex: 'zI',
  // common
  opacity: 'o',
  background: 'bg',
  backgroundColor: 'bgC',
  backgroundImage: 'bgI',
  backgroundSize: 'bgS',
  backgroundRepeat: 'bgR',
  backgroundPosition: 'bgP',
  display: 'd',
  visibility: 'v',
  // text
  lines: 'ls',
  color: 'c',
  fontSize: 'foS',
  fontStyle: 'fSt',
  fontWeight: 'foW',
  textDecoration: 'tD',
  textAlign: 'tA',
  lineHeight: 'lH',
  textOverflow: 'tO',
  // animation
  transform: 'ts',
  transformOrigin: 'tsO',
  animationName: 'aN',
  animationDuration: 'aD',
  animationTimingFunction: 'aTF',
  animationDelay: 'aDe',
  animationIterationCount: 'aIC',
  animationFillMode: 'aFM',
  // custom
  placeholderColor: 'pC',
  selectedColor: 'sC',
  textColor: 'tC',
  timeColor: 'tiC',
  textHighlightColor: 'tHC',
  strokeWidth: 'sW',
  progressColor: 'prC',
  indicatorColor: 'iC',
  indicatorSelectedColor: 'iSC',
  slideWidth: 'slW',
  slideMargin: 'sM',
  resizeMode: 'rM',
  columns: 'col',
  columnSpan: 'cS',
  maskColor: 'mC',
  // custom style
  starBackground: 'sB',
  starForeground: 'sF',
  starSecondary: 'sS'
}

/**
 * 压缩后代选择器
 * @param itemList
 * @returns {*|Array}
 */
function compressDescSelector(itemList) {
  itemList = itemList[0] || []
  for (let i = 0; i < itemList.length; i++) {
    const item = itemList[i] || {}

    cssDescSelectorList.forEach(function (ccl) {
      if (item.hasOwnProperty(ccl.oldN)) {
        item[ccl.newN] = item[ccl.oldN]
        delete item[ccl.oldN]
        if (ccl.oldV && ccl.oldV.indexOf(item[ccl.newN]) > -1) {
          item[ccl.newN] = ccl.newV[ccl.oldV.indexOf(item[ccl.newN])]
        }
      }
    })
  }
  return itemList
}

/**
 * 压缩CSS属性名
 * @param jsonStyle
 */
function compressCssAttr(jsonStyle) {
  for (const selector in jsonStyle) {
    const cssAttrObj = jsonStyle[selector]
    if (selector !== '@KEYFRAMES' && typeof cssAttrObj === 'object') {
      for (const cssAttrName in cssAttrObj) {
        if (cssAttrMap[cssAttrName]) {
          const cssAttrAbbrName = cssAttrMap[cssAttrName]
          cssAttrObj[cssAttrAbbrName] = cssAttrObj[cssAttrName]
          delete cssAttrObj[cssAttrName]
        }
      }
    }
  }
}

export { compressDescSelector, compressCssAttr }
