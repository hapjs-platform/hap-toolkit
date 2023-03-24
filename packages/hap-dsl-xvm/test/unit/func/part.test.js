/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')
const { resolveEntries, compileFiles } = require('../../utils')

describe('分包测试', () => {
  const basePath = path.join(__dirname, '../../case/ux')
  const entries = resolveEntries(basePath, 'PartPack')
  const buildPath = path.join(__dirname, '../../build/ux/PartPack')

  beforeAll(() => {
    return compileFiles(entries)
  }, 30000)

  const {
    createPackagesDefinition,
    allocateResourceToPackages
  } = require('@hap-toolkit/packager/lib/subpackages/index')

  const files = [
    'manifest.json',
    'app.js',
    'Home/home.js',
    'Common/logo.png',
    'PackageA/Common/logo.png',
    'PackageA/Page1/Page1.js',
    'PackageB/Common/logo.png',
    'PackageB/Page2/Page2.js'
  ]

  // 摘取分包所需的资源文件
  function getPkgDefResourceList(pkgDefs) {
    const pkgDefResourceList = []

    pkgDefs.subPackages.forEach(part => {
      pkgDefResourceList.push(part.resourceList.map(res => res.fileBuildPath))
    })
    pkgDefResourceList.push(pkgDefs.fullPackage.resourceList.map(res => res.fileBuildPath))

    return pkgDefResourceList
  }

  it('manifest的subpackages有配置信息', () => {
    const subpackages = [
      {
        name: 'part1',
        resource: 'PackageA'
      },
      {
        name: 'part2',
        resource: 'PackageB',
        standalone: true
      }
    ]
    let packageDefs = createPackagesDefinition('', subpackages)
    const subPackages = packageDefs.subPackages

    expect(subPackages.length).toBe(3)
    expect(subPackages[0].fileName).toMatch(/\.srpk$/)
    expect(subPackages[1].fileName).toMatch(/\.srpk$/)
    expect(subPackages[2].fileName).toMatch(/\.srpk$/)
    expect(packageDefs.fullPackage.fileName).toMatch(/rpk$/)

    allocateResourceToPackages(files, buildPath, packageDefs.fullPackage, packageDefs.subPackages)

    const pkgDefResourceList = getPkgDefResourceList(packageDefs)
    const expectResult = [
      ['manifest.json', 'app.js', 'Home/home.js', 'Common/logo.png'],
      ['PackageA/Common/logo.png', 'PackageA/Page1/Page1.js'],
      ['manifest.json', 'PackageB/Common/logo.png', 'PackageB/Page2/Page2.js'],
      [
        'manifest.json',
        'app.js',
        'Home/home.js',
        'Common/logo.png',
        'PackageA/Common/logo.png',
        'PackageA/Page1/Page1.js',
        'PackageB/Common/logo.png',
        'PackageB/Page2/Page2.js'
      ]
    ]
    expect(pkgDefResourceList).toEqual(expectResult)
  })

  it('manifest的subpackages无配置信息', () => {
    const subpackages = undefined
    const { fullPackage, subPackages } = createPackagesDefinition('', subpackages)

    expect(subPackages).toBe(undefined)
    expect(fullPackage.fileName).toMatch(/rpk$/)
  })
})
