const path = require('path')
const cp = require('child_process')
const fs = require('fs-extra')

const toolkitRoot = path.resolve(__dirname, '..')

const run = require(path.resolve(toolkitRoot, 'packages/hap-dev-utils/src/index.js')).run
const { compile, stopWatch } = require(path.resolve(
  toolkitRoot,
  'packages/hap-toolkit/lib/commands/compile.js'
))

let hapBin = path.resolve(toolkitRoot, 'packages/hap-toolkit/bin/index.js')

const cwd = path.resolve(toolkitRoot, 'examples/sample')

cp.execSync('rm -rf ./node_modules/.cache', { cwd })
let sum = 30

async function runBuild(disableCache) {
  const timeArr = []
  for (let i = 0; i < sum + 1; i++) {
    console.log(`\n\n${disableCache ? 'disableCache, ' : 'enableCache, '}i: ${i}\n\n`)
    const start = Date.now()
    await run('node', [hapBin, 'build', disableCache ? '--disableCache' : ''], [], {
      cwd
    })
    const time = Date.now() - start
    timeArr.push(time)
  }

  timeArr.shift()
  const totlaTime = parseFloat(timeArr.reduce((sum, curr) => sum + curr, 0).toFixed(2))
  const averageTime = parseFloat((totlaTime / sum).toFixed(2))
  console.log(`totlaTime:`, totlaTime)
  console.log(`averageTime:`, averageTime)
  return [averageTime, totlaTime]
}

const homeUxFile = path.resolve(cwd, './src/home/index.ux')
const content = fs.readFileSync(homeUxFile, 'utf-8')

async function runWatch(disableCache) {
  let start
  let timeArr = []
  // const params = { action: 'progress', percentage }
  function callback(params) {
    if (params.action === 'progress') {
      if (params.percentage === 0) {
        start = Date.now()
        console.log(`new start`, start)
      }
      if (params.percentage === 1 && start) {
        // watch 模式才会进入
        const duration = Date.now() - start
        start = undefined
        timeArr.push(duration)
        console.log(`new end, duration`, duration)
      }
    }
  }

  function waitFor(num) {
    return new Promise((resolve, reject) => {
      const id = setInterval(() => {
        if (timeArr.length === num) {
          resolve()
          clearInterval(id)
        }
      }, 50)
    })
  }

  await compile('native', 'dev', true, { cwd, callback, disableCache }, undefined, undefined)
  for (let i = 0; i < sum + 1; i++) {
    await fs.writeFile(
      homeUxFile,
      content.replace('// benchmark-placeholder', `console.log(${i})`),
      'utf-8'
    )
    await waitFor(i)
  }

  await stopWatch()
  timeArr.shift()
  const totlaTime = parseFloat(timeArr.reduce((sum, curr) => sum + curr, 0).toFixed(2))
  const averageTime = parseFloat((totlaTime / sum).toFixed(2))
  console.log(`totlaTime:`, totlaTime)
  console.log(`averageTime:`, averageTime)
  return [averageTime, totlaTime]
}

;(async () => {
  const [noCacheAverageTime, noCacheTotlaTime] = await runBuild(true)
  const [cachedAverageTime, cachedTotlaTime] = await runBuild()
  const multiple = parseFloat((noCacheAverageTime / cachedAverageTime).toFixed(2))

  const [noCacheAverageTime1, noCacheTotlaTime1] = await runWatch(true)
  await fs.writeFile(homeUxFile, content, 'utf-8')
  const [cachedAverageTime1, cachedTotlaTime1] = await runWatch()
  await fs.writeFile(homeUxFile, content, 'utf-8')
  const multiple1 = parseFloat((noCacheAverageTime1 / cachedAverageTime1).toFixed(2))

  console.log(`\n\n`)
  console.log(`----------run build----------`)
  console.table({ noCacheAverageTime, cachedAverageTime, multiple })

  console.log(`----------run watch----------`)
  console.table({ noCacheAverageTime1, cachedAverageTime1, multiple1 })
})()
