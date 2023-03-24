/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')
const { getRecords, clearProjectRecord } = require('@hap-toolkit/shared-utils/lib/record-client')
const globalConfig = require('@hap-toolkit/shared-utils/config')
const { launchServer } = require('../lib')
const cwd = path.resolve(__dirname, '../fixtures/app')

describe('server', () => {
  const { clientRecordPath } = globalConfig
  const ip = '10.20.30.40'
  let request = require('supertest')
  let server
  beforeAll(() => {
    return launchServer({
      cwd,
      port: 8083,
      disableADB: true,
      openDebugger: false,
      watch: false
    }).then((data) => {
      server = data.server
    })
  }, 5000)

  it('record clients', () => {
    return request(server)
      .get('/qrcode')
      .set('Host', '172.00.000.000:8000')
      .set('x-forwarded-for', ip)
      .then((response) => {
        const recordData = getRecords(clientRecordPath)
        expect(recordData.records[cwd][0].ip).toEqual(ip)
      })
  })

  it('clear project clients', () => {
    clearProjectRecord(clientRecordPath)
  })

  it('record clients again', () => {
    let recordData = getRecords(clientRecordPath)
    expect(recordData.records[cwd]).toMatchObject([])
    return request(server)
      .get('/qrcode')
      .set('Host', '172.00.000.000:8000')
      .set('x-forwarded-for', ip)
      .then((response) => {
        recordData = getRecords(clientRecordPath)
        expect(recordData.records[cwd][0].ip).toEqual(ip)
      })
  })

  afterAll((done) => {
    setTimeout(() => {
      server.close(done)
    }, 1000)
  })
})
