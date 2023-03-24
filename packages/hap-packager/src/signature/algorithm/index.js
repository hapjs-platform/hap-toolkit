/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'crypto'
import rs from 'jsrsasign'
import { colorconsole } from '@hap-toolkit/shared-utils'

import Base64 from './base64'
import CRC32 from './crc32'

import { getRemoteCryptoSignFunction, defaultCryptoSignFunction } from './signer'

function unZipFiles(fileBuf, files) {
  // 读取zip文件
  if (!fileBuf || fileBuf.length <= 4) {
    colorconsole.error('### App Loader ### Zip文件打开失败')
    return false
  }

  // 检查文件类型是否正确
  const filemagic = fileBuf.readInt32LE(0)
  if (filemagic !== 0x4034b50) {
    colorconsole.error('### App Loader ### Zip文件格式错误')
    return false
  }

  // 解析数据块
  const chunks = parserZip(fileBuf)
  // TODO 待删除options
  chunks.options = { files }

  if (chunks.tag) {
    // 解析成功, 生成签名块
    // 分别处理3个块签名
    Object.keys(chunks.sections).forEach((item) => {
      const chunk = chunks.sections[item]
      processChunk(fileBuf, chunk)
    })

    return [chunks, fileBuf]
  }

  return false
}

/**
 * 为 zip buffer 签名，获得签名后的 buffer
 *
 * @param fileBuf ZIP文件的内容
 * @param files 文件列表，每个元素拥有：name, hash
 * @param prikey
 * @param certpem
 */
function doSign(fileBuf, files, prikey, certpem) {
  const result = unZipFiles(fileBuf, files)
  if (!result) {
    return false
  }

  const [chunks] = result

  // 生成整体签名
  signChunk(chunks, prikey, certpem)
  // 写入zip文件
  const signContent = saveChunk(fileBuf, chunks)

  return signContent
}

/**
 * 解析Zip, 分解数据块
 * @param buf
 */
function parserZip(buf) {
  const chunk = {
    tag: false,
    length: buf.length,
    sections: {
      header: null,
      central: null,
      footer: null
    }
  }

  chunk.sections.footer = readEOCD(buf) // 至少22个字节
  if (chunk.sections.footer.tag) {
    chunk.sections.central = readCD(
      buf,
      chunk.sections.footer.previous,
      chunk.sections.footer.startIndex - chunk.sections.footer.previous
    )
    if (chunk.sections.central.tag) {
      chunk.sections.header = readFH(
        buf,
        chunk.sections.central.previous,
        chunk.sections.central.startIndex - chunk.sections.central.previous
      )
      if (chunk.sections.header.tag) {
        chunk.tag = true
      }
    }
  }

  return chunk
}

/**
 * 从后往前读取
 * @param buf
 */
function readEOCD(buf) {
  const chunk = {
    tag: false
  }

  if (buf && buf.length >= 22) {
    let offset = buf.length - 22
    let tag
    // 从开始位置往前单个字节读取, 检查
    while (offset >= 0) {
      tag = buf.readInt32LE(offset)
      if (tag === 0x6054b50) {
        // 如果找到起始位置
        chunk.tag = true
        chunk.startIndex = offset
        chunk.len = buf.length - offset
        chunk.previous = buf.readInt32LE(offset + 16)
        break
      }
      offset -= 1
    }
  }
  return chunk
}

/**
 * 从后往前读取
 * @param buf
 * @param offset
 * @param size
 */
function readCD(buf, offset, size) {
  const chunk = {
    tag: false
  }

  if (buf && buf.length >= offset) {
    const tag = buf.readInt32LE(offset)
    if (tag === 0x2014b50) {
      // 如果找到起始位置
      chunk.tag = true
      chunk.startIndex = offset
      chunk.len = size
      chunk.previous = buf.readInt32LE(offset + 42)
    }
  }
  return chunk
}

/**
 * 从后往前读取
 * @param buf
 * @param offset
 * @param size
 */
function readFH(buf, offset, size) {
  const chunk = {
    tag: false
  }

  if (buf && buf.length >= offset) {
    const tag = buf.readInt32LE(offset)
    if (tag === 0x4034b50) {
      // 如果找到起始位置
      chunk.tag = true
      chunk.startIndex = offset
      chunk.len = size
      chunk.previous = -1
    }
  }
  return chunk
}

/**
 * 数据块hash
 * @param buf
 * @param chunk
 */
function processChunk(buf, chunk) {
  // 存储每个块的摘要
  const cur = chunk.startIndex
  const end = chunk.startIndex + chunk.len
  const chk = buf.slice(cur, end)
  const header = Buffer.alloc(5 + chunk.len)
  header[0] = 0xa5
  header.writeInt32LE(chk.length, 1)
  chk.copy(header, 5)

  const signer = crypto.createHash('SHA256')
  signer.update(header)
  chunk.sign = signer.digest()
}

/**
 * 对整个chunk签名
 * @param chunks
 * @param prikey
 * @param certpem
 */
function signChunk(chunks, prikey, certpem) {
  const sections = chunks.sections

  // 二进制拼接每个块摘要
  const length =
    sections.header.sign.length + sections.central.sign.length + sections.footer.sign.length + 5
  const wholedata = Buffer.alloc(length)
  let offset = 0
  wholedata.writeInt8(0x5a, 0)
  wholedata.writeInt32LE(3, 1)
  offset += 5

  function writeBuffer(buf) {
    buf.copy(wholedata, offset)
    offset += buf.length
  }

  writeBuffer(sections.header.sign)
  writeBuffer(sections.central.sign)
  writeBuffer(sections.footer.sign)

  // 计算整体摘要
  const signer = crypto.createHash('SHA256')
  signer.update(wholedata)
  const signature = signer.digest()

  // 生成sign block, 计算block总长度, 向buf中考入数据
  const signchunk = makeSignChunk(chunks.options, signature, prikey, certpem)
  chunks.signchunk = saveSignChunk(signchunk)
}

/**
 *
 * @param options
 * @param sign
 * @param prikey
 * @param certpem
 */
function makeSignChunk(options, sign, prikey, certpem) {
  // 提取公钥
  const cert = Buffer.from(Base64.unarmor(certpem))
  const c = new rs.X509()
  c.readCertPEM(certpem.toString())
  const pubkey = rs.KEYUTIL.getPEM(c.subjectPublicKeyRSA)

  // 摘要块
  const digestBuf = Buffer.alloc(sign.length + 12)
  digestBuf.writeInt32LE(sign.length + 8, 0)
  digestBuf.writeInt32LE(0x0103, 4)
  digestBuf.writeInt32LE(sign.length, 8)
  sign.copy(digestBuf, 12)
  const digestBlock = {
    len: digestBuf.length,
    buffer: digestBuf
  }

  // 证书块
  const certBuf = Buffer.alloc(cert.length + 4)
  certBuf.writeInt32LE(cert.length, 0)
  cert.copy(certBuf, 4)
  const certBlock = {
    len: certBuf.length,
    buffer: certBuf
  }

  // 签名数据
  const signdataBlock = {
    len: 12,
    digests: {
      size: 0,
      data: []
    },
    certs: {
      size: 0,
      data: []
    },
    additional: 0
  }
  signdataBlock.digests.data.push(digestBlock)
  signdataBlock.digests.size += digestBlock.len
  signdataBlock.len += digestBlock.len

  signdataBlock.certs.data.push(certBlock)
  signdataBlock.certs.size += certBlock.len
  signdataBlock.len += certBlock.len

  // 将public.pem转化为der
  const pubbuf = Buffer.from(Base64.unarmor(pubkey))
  const signBlock = {
    len: 16 + pubbuf.length,
    size: 12 + pubbuf.length,
    signdata: {
      size: 0,
      buffer: null
    },
    signatures: {
      size: 0,
      data: []
    },
    pubkey: {
      size: pubbuf.length,
      buffer: pubbuf
    }
  }

  signBlock.signdata.buffer = makeSignDataBuffer(signdataBlock)
  signBlock.signdata.size = signdataBlock.len
  signBlock.size += signdataBlock.len
  signBlock.len += signdataBlock.len

  // 生成签名
  const signature = callCryptoSignFunction(signBlock.signdata.buffer, prikey, certpem)

  const signatureBlock = {
    len: signature.length + 12,
    size: signature.length + 8,
    id: 0x0103,
    buffer: signature
  }

  signBlock.signatures.data.push(signatureBlock)
  signBlock.signatures.size += signatureBlock.len
  signBlock.size += signatureBlock.len
  signBlock.len += signatureBlock.len

  const signBlocks = {
    len: 4,
    size: 0,
    data: []
  }
  signBlocks.data.push(signBlock)
  signBlocks.size += signBlock.len
  signBlocks.len += signBlock.len

  // 生成key-value
  const kvBlock = {
    len: signBlocks.len + 12,
    size: signBlocks.len + 4,
    id: 0x01000101,
    value: signBlocks
  }

  const signchunk = {
    len: 32,
    size: 24,
    data: []
  }
  signchunk.data.push(kvBlock)
  signchunk.size += kvBlock.len
  signchunk.len += kvBlock.len

  // 添加文件列表hash kvblock
  if (options.files) {
    const filehashChunk = signFiles(options.files, prikey, certpem)
    if (filehashChunk) {
      const filesignBlocks = {
        len: 4,
        size: 0,
        data: []
      }
      filesignBlocks.data.push(filehashChunk)
      filesignBlocks.size += filehashChunk.length
      filesignBlocks.len += filehashChunk.length

      const filekvBlock = {
        len: filesignBlocks.len + 12,
        size: filesignBlocks.len + 4,
        id: 0x01000201,
        value: filesignBlocks
      }

      signchunk.data.push(filekvBlock)
      signchunk.size += filekvBlock.len
      signchunk.len += filekvBlock.len
    }
  }

  return signchunk
}

/**
 *
 * @param block
 */
function makeSignDataBuffer(block) {
  const buffer = Buffer.alloc(block.len)
  let offset = 0

  buffer.writeInt32LE(block.digests.size, offset)
  offset += 4
  block.digests.data.forEach((item) => {
    item.buffer.copy(buffer, offset)
    offset += item.len
  })

  buffer.writeInt32LE(block.certs.size, offset)
  offset += 4
  block.certs.data.forEach((item) => {
    item.buffer.copy(buffer, offset)
    offset += item.len
  })

  buffer.writeInt32LE(block.additional, offset)
  return buffer
}

const SigMagic = 'RPK Sig Block 42'

/**
 *
 * @param signchunk
 */
function saveSignChunk(signchunk) {
  const buffer = Buffer.alloc(signchunk.len)
  let offset = 0

  // 大小
  buffer.writeInt32LE(signchunk.size, offset)
  offset += 4
  buffer.writeInt32LE(0, offset)
  offset += 4

  // key-value
  signchunk.data.forEach((kv) => {
    buffer.writeInt32LE(kv.size, offset)
    offset += 4
    buffer.writeInt32LE(0, offset)
    offset += 4

    buffer.writeInt32LE(kv.id, offset)
    offset += 4

    // value
    buffer.writeInt32LE(kv.value.size, offset)
    offset += 4

    if (kv.id === 0x01000101) {
      // sign blocks
      kv.value.data.forEach((block) => {
        buffer.writeInt32LE(block.size, offset)
        offset += 4

        // signdata
        buffer.writeInt32LE(block.signdata.size, offset)
        offset += 4

        block.signdata.buffer.copy(buffer, offset)
        offset += block.signdata.buffer.length

        // signature
        buffer.writeInt32LE(block.signatures.size, offset)
        offset += 4

        block.signatures.data.forEach((signature) => {
          buffer.writeInt32LE(signature.size, offset)
          offset += 4

          buffer.writeInt32LE(signature.id, offset)
          offset += 4

          buffer.writeInt32LE(signature.buffer.length, offset)
          offset += 4

          signature.buffer.copy(buffer, offset)
          offset += signature.buffer.length
        })

        // pubkey
        buffer.writeInt32LE(block.pubkey.size, offset)
        offset += 4
        block.pubkey.buffer.copy(buffer, offset)
        offset += block.pubkey.buffer.length
      })
    } else if (kv.id === 0x01000201) {
      // files blocks
      kv.value.data.forEach((block) => {
        block.copy(buffer, offset)
        offset += block.length
      })
    }
  })

  // 大小
  buffer.writeInt32LE(signchunk.size, offset)
  offset += 4
  buffer.writeInt32LE(0, offset)
  offset += 4

  // 魔法值
  const magic = Buffer.from(SigMagic)
  magic.copy(buffer, offset)
  return buffer
}

/**
 * 为 buffer 添加签名文件
 * @param buf
 * @param chunks
 */
function saveChunk(buf, chunks) {
  // 创建新buffer
  const newBuffer = Buffer.alloc(buf.length + chunks.signchunk.length)
  let offset = 0
  const sections = chunks.sections

  // 拷贝header
  buf.copy(
    newBuffer,
    offset,
    sections.header.startIndex,
    sections.header.startIndex + sections.header.len
  )
  offset += sections.header.len

  // 拷贝signblock
  chunks.signchunk.copy(newBuffer, offset)
  offset += chunks.signchunk.length

  // 拷贝central
  buf.copy(
    newBuffer,
    offset,
    sections.central.startIndex,
    sections.central.startIndex + sections.central.len
  )
  offset += sections.central.len

  // 修改eocd
  buf.writeInt32LE(
    sections.central.startIndex + chunks.signchunk.length,
    sections.footer.startIndex + 16
  )
  // 拷贝eocd
  buf.copy(
    newBuffer,
    offset,
    sections.footer.startIndex,
    sections.footer.startIndex + sections.footer.len
  )
  offset += sections.footer.len

  return newBuffer
}

/**
 * 加签名文件
 * @param filehashs
 * @param prikey
 * @param certpem
 */
function signFiles(filehashs, prikey, certpem) {
  const chunk = {
    len: 8,
    size: 4,
    digests: [],
    sign: null
  }

  // 生成hash块
  filehashs.forEach((item) => {
    // name hash
    const namehash = CRC32.digest(item.name)

    // 计算大小
    const sum = 6 + item.hash.length
    const chk = Buffer.alloc(sum)
    let offset = 0
    chk.writeInt32LE(namehash, offset)
    offset += 4

    chk.writeInt16LE(item.hash.length, offset)
    offset += 2
    item.hash.copy(chk, offset)
    offset += item.hash.length

    chunk.digests.push(chk)
    chunk.size += sum
    chunk.len += sum
  })

  // 生成整体签名
  signDigestChunk(chunk, prikey, certpem)

  // 写入文件
  return saveDigestChunk(chunk)
}

/**
 *
 * @param chunk
 * @param prikey
 * @param certpem
 */
function signDigestChunk(chunk, prikey, certpem) {
  const buf = Buffer.alloc(chunk.size)
  let offset = 0
  buf.writeInt32LE(0x0103, offset)
  offset += 4

  chunk.digests.forEach((chk) => {
    chk.copy(buf, offset)
    offset += chk.length
  })
  chunk.digests = buf.slice()

  // 生成签名
  const signature = callCryptoSignFunction(buf, prikey, certpem)

  chunk.sign = {
    len: 12 + signature.length,
    size: 8 + signature.length,
    id: 0x0103,
    data: signature
  }
  chunk.len += chunk.sign.len
}

/**
 * @param chunk
 */
function saveDigestChunk(chunk) {
  // 创建新buffer
  const newBuffer = Buffer.alloc(chunk.len)

  let offset = 0
  newBuffer.writeInt32LE(chunk.size, offset)
  offset += 4

  // 文件hash列表
  chunk.digests.copy(newBuffer, offset)
  offset += chunk.digests.length

  // 写入签名
  newBuffer.writeInt32LE(chunk.sign.size, offset)
  offset += 4
  newBuffer.writeInt32LE(chunk.sign.id, offset)
  offset += 4
  newBuffer.writeInt32LE(chunk.sign.data.length, offset)
  offset += 4

  chunk.sign.data.copy(newBuffer, offset)
  offset += chunk.sign.data.length

  return newBuffer
}

function callCryptoSignFunction(buffer, prikey, certpem) {
  let signature = null
  if (!getRemoteCryptoSignFunction()) {
    // 使用默认
    signature = defaultCryptoSignFunction(buffer, prikey)
  } else {
    // 使用外部：传递原文件内容、证书内容
    const remoteCryptoSignFunction = getRemoteCryptoSignFunction()
    signature = remoteCryptoSignFunction(buffer, certpem)
  }
  return signature
}

module.exports = {
  doSign
}
