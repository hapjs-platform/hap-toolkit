/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

// 表达式中允许的关键字
const allowedKeywords =
  'Infinity,undefined,NaN,null,isFinite,isNaN,true,false,' +
  'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
  'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,' +
  'this,' + // this
  'require' // 适配 Webpack/Browserify
const allowedKeywordsRE = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)')

// 表达式中不能包含的关键字
const improperKeywords =
  'break,case,class,catch,const,continue,debugger,default,' +
  'delete,do,else,export,extends,finally,for,function,if,' +
  'import,in,instanceof,let,return,super,switch,throw,try,' +
  'var,while,with,yield,enum,await,implements,package,' +
  'protected,static,interface,private,public'
const improperKeywordsRE = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)')

const wsRE = /\s/g
const newlineRE = /\n/g
const saveRE =
  /[{,]\s*[\w$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g
const restoreRE = /"(\d+)"/g
const pathTestRE =
  /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/
const identRE = /[^\w$.](?:[A-Za-z_$][\w$]*)/g
const literalValueRE = /^(?:true|false|null|undefined|Infinity|NaN)$/

const saveRegRe = /(\/.+\/[gimy]*)/g
const restoreRegRe = /"&&&(\d+)"/g

const saved = []
const savedReg = []

/**
 * 将目标字符串替换为索引
 * @param str
 * @param isString
 * @returns {string}
 */
function save(str, isString) {
  const i = saved.length
  saved[i] = isString
    ? str.replace(newlineRE, '\\n') // 回车转变为'\\n'
    : str
  return '"' + i + '"'
}

/**
 * 将正则表达式替换为索引 &&& + i
 * @param str
 * @returns {string}
 */
function saveReg(str) {
  const i = savedReg.length
  savedReg[i] = str
  // 使用&&&防止被\w匹配到
  return '"' + '&&&' + i + '"'
}

/**
 * 将之前save的数字转换为字符串
 * @param {String} raw
 * @return {String}
 */
function rewrite(raw) {
  const c = raw.charAt(0)
  let path = raw.slice(1)
  if (allowedKeywordsRE.test(path)) {
    return raw
  } else {
    path = path.indexOf('"') > -1 ? path.replace(restoreRE, restore) : path
    return c + 'this.' + path
  }
}

/**
 * 获取save字符串
 * @param str
 * @param i
 * @returns {*}
 */
function restore(str, i) {
  return saved[i]
}

/**
 * 获取saveReg正则表达式字符串
 * @param str
 * @param i
 * @returns {*}
 */
function restoreReg(str, i) {
  return savedReg[i]
}

/**
 * 编译表达式, 添加this前缀
 * @param {String} exp
 * @return {Function}
 */
function compileGetter(exp) {
  /* istanbul ignore if */
  if (improperKeywordsRE.test(exp)) {
    console.warn('### App Toolkit ### 不要在表达式中使用保留关键字: ' + exp)
  }
  // 重置状态
  saved.length = 0
  // 处理表达式
  let body = exp.replace(saveRE, save).replace(saveRegRe, saveReg).replace(wsRE, '') // 剔除空格/分隔符
  // 生成新表达式
  body = (' ' + body)
    .replace(identRE, rewrite)
    .replace(restoreRegRe, restoreReg)
    .replace(restoreRE, restore)
  return body.trim()
}

/**
 * 解析表达式
 * @param {String} exp
 * @return {String}
 */
function parseExpression(exp) {
  exp = exp.trim()
  // 处理正则表达式字面量
  const regReg = /^\/.+\/[gimy]*$/
  if (regReg.test(exp)) {
    return exp
  }

  const res =
    isSimplePath(exp) && exp.indexOf('[') < 0
      ? 'this.' + exp // 简单表达式, 直接添加this即可
      : compileGetter(exp) // 复杂表达式, 需要遍历处理
  return res
}

/**
 * 检查表达式简单路径
 * @param {String} exp
 * @return {Boolean}
 */
function isSimplePath(exp) {
  return (
    pathTestRE.test(exp) &&
    // true/false/null/undefined/Infinity/NaN
    !literalValueRE.test(exp) &&
    // Math常量
    exp.slice(0, 5) !== 'Math.'
  )
}

module.exports = {
  parseExpression: parseExpression
}
