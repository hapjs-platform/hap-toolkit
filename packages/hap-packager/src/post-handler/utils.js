import { templater } from '@hap-toolkit/compiler'
const { validator } = templater

const pathTestRE =
  /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/

const literalValueRE = /^(?:true|false|null|undefined|Infinity|NaN)$/

export function isExpr(val) {
  if (!val) return false
  return validator.isExpr(val)
}

export function isFunctionStr(str) {
  const pattern = /^\s*function\s*\([\w\s,$]*\)\s*\{[\s\S]*\}\s*$/
  return pattern.test(str.trim())
}

export function isObject(obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]' && obj !== null
}

export function isConstObjOrArray(exp) {
  try {
    // "[1, 2, 3]"、"{a: 1}" 常量作为模板内容时
    // eslint-disable-next-line no-eval
    eval(`(${exp})`)
    return true
  } catch (e) {
    return false
  }
}

export function isSimpleArr(exp) {
  // a.b.c，或 a['b']['c'] 返回 true
  // eslint-disable-next-line no-useless-escape
  const regex = /\[([^\[\]]+)\]/g
  let match
  const results = []

  while ((match = regex.exec(exp)) !== null) {
    results.push(match[1])
  }

  let res = true
  // 检查所有[]匹配项是否全部为数字或常量字符串
  results.forEach((content) => {
    if (!/^\d+$/.test(content) && !/^('|"|`)(.*)\1$/.test(content)) {
      res = false
    }
  })
  return res
}

export function isSimplePath(exp) {
  return (
    pathTestRE.test(exp) &&
    // true/false/null/undefined/Infinity/NaN
    !literalValueRE.test(exp) &&
    // Math常量
    exp.slice(0, 5) !== 'Math.'
  )
}
