/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

module.exports = {
  type: 'object',
  required: ['package', 'name', 'icon', 'versionCode', 'config', 'router'],
  properties: {
    package: {
      type: 'string',
      errorMessage: ' 字段必须为 string 类型'
    },
    name: {
      // TODO 6个汉字以内
      type: 'string',
      errorMessage: ' 字段必须为 string 类型'
    },
    icon: {
      type: 'string',
      errorMessage: ' 字段必须为 string 类型'
    },
    banner: {
      type: 'string',
      errorMessage: ' 字段必须为 string 类型'
    },
    versionName: {
      type: 'string',
      errorMessage: ' 字段必须为 string 类型'
    },
    versionCode: {
      type: ['number'],
      errorMessage: ' 字段必须为 Integer 类型'
    },
    minPlatformVersion: {
      type: ['number'],
      errorMessage: ' 字段必须为 Integer 类型'
    },
    features: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            errorMessage: ' 字段必须为 string 类型'
          }
        },
        errorMessage: {
          type: " 字段类型必须为 'object'"
        }
      },
      errorMessage: ' 字段必须为 array 类型'
    },
    config: {
      type: 'object',
      properties: {
        logLevel: {
          enum: ['off', 'error', 'warn', 'info', 'log', 'debug'],
          errorMessage: ' 字段只能为 off, error, warn, info, log, debug'
        },
        designWidth: {
          type: 'number',
          errorMessage: ' 字段必须为 number 类型'
        },
        data: {
          // TODO 全局数据对象，属性名不能以$或_开头，
          type: 'object',
          errorMessage: ' 字段必须为 object 类型'
        },
        background: {
          // TODO 更详细的后台运行配置信息，
          type: 'object',
          errorMessage: ' 字段必须为 object 类型'
        },
        network: {
          // TODO 更详细的网络配置信息，
          type: 'object',
          errorMessage: ' 字段必须为 object 类型'
        }
      },
      errorMessage: {
        type: " 字段类型必须为 'object'"
      }
    },
    router: {
      // TODO 更详细的后台运行配置信息，
      type: 'object',
      required: ['entry', 'pages'],
      properties: {
        entry: {
          type: 'string',
          errorMessage: ' 字段必须为 string 类型'
        },
        // TODO 看下 key 不确定能否校验值，
        pages: {
          type: 'object',
          errorMessage: ' 字段必须为 object 类型'
        },
        errorPage: {
          type: 'string',
          errorMessage: ' 字段必须为 string 类型'
        },
        // TODO 看下 key 不确定能否校验值，
        widgets: {
          type: 'object',
          errorMessage: ' 字段必须为 object 类型'
        }
      },
      errorMessage: ' 字段必须为 object 类型'
    },
    display: {
      type: 'object',
      properties: {
        backgroundColor: {
          // TODO HEXColor
          type: 'string',
          errorMessage: ' 字段必须为 string 类型'
        },
        fullScreen: {
          type: 'boolean',
          errorMessage: ' 字段必须为 boolean 类型'
        },
        titleBar: {
          type: 'boolean',
          errorMessage: ' 字段必须为 boolean 类型'
        },
        titleBarBackgroundColor: {
          // TODO HEXColor
          type: 'string',
          errorMessage: ' 字段必须为 string 类型'
        },
        titleBarTextColor: {
          // TODO HEXColor
          type: 'string',
          errorMessage: ' 字段必须为 string 类型'
        },
        menu: {
          type: 'boolean',
          errorMessage: ' 字段必须为 boolean 类型'
        },
        windowSoftInputMode: {
          enum: ['adjustPan', 'adjustResize'],
          errorMessage: ' 字段只能为 adjustPan 或 adjustResize'
        },
        pages: {
          type: 'object',
          errorMessage: {
            type: " 字段类型必须为 'object'"
          }
        },
        orientation: {
          enum: ['portrait', 'landscape'],
          errorMessage: ' 字段只能为 portrait 或 landscape'
        },
        statusBarImmersive: {
          type: 'boolean',
          errorMessage: ' 字段必须为 boolean 类型'
        },
        statusBarTextStyle: {
          enum: ['light', 'dark', 'auto'],
          errorMessage: ' 字段只能为 light, dark 或 auto'
        },
        statusBarBackgroundColor: {
          type: 'string',
          errorMessage: ' 字段必须为 string 类型'
        },
        statusBarBackgroundOpacity: {
          type: 'number',
          errorMessage: ' 字段必须为 number 类型'
        },
        fitCutout: {
          enum: ['none', 'portrait', 'landscape'],
          errorMessage: ' 字段只能为 none portrait, landscape'
        },
        textSizeAdjust: {
          enum: ['none', 'auto'],
          errorMessage: ' 字段只能为 none 或 auto'
        },
        themeMode: {
          enum: [-1, 0, 1],
          errorMessage: ' 字段只能为 -1, 0 或 1'
        },
        menuBarData: {
          // TODO 详细校验
          type: 'object',
          errorMessage: ' 字段必须为 object 类型'
        },
        forceDark: {
          type: 'boolean',
          errorMessage: ' 字段必须为 boolean 类型'
        },
        pageCache: {
          type: 'boolean',
          errorMessage: ' 字段必须为 boolean 类型'
        },
        cacheDuration: {
          type: 'number',
          errorMessage: ' 字段必须为 number 类型'
        }
      },
      errorMessage: {
        type: " 字段类型必须为 'object'"
      }
    },
    subpackages: {
      // TODO 与后面的分包校验融合
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            errorMessage: ' 字段必须为 string 类型'
          },
          // TODO 详细的规则校验
          resource: {
            type: 'string',
            errorMessage: ' 字段必须为 string 类型'
          }
        },
        // 是否必须?
        required: ['name', 'resource'],
        errorMessage: {
          type: 'tabBar.list[n] 必须为 string 类型',
          required: ' 必须包含 name、resource 字段'
        }
      },
      errorMessage: {
        type: ' 字段必须为长度 2 到 5 的 array 数组'
      }
    },
    menuBarData: {
      type: 'object',
      properties: {
        menuBar: {
          type: 'boolean',
          errorMessage: ' 字段必须为 boolean 类型'
        },
        menuBarStyle: {
          enum: ['dark', 'light'],
          errorMessage: ' 字段只能为 adjustPan 或 adjustResize'
        },
        shareTitle: {
          type: 'string',
          errorMessage: ' 字段必须为 string 类型'
        },
        shareDescription: {
          type: 'string',
          errorMessage: ' 字段必须为 string 类型'
        },
        shareIcon: {
          type: 'string',
          errorMessage: ' 字段必须为 string 类型'
        },
        shareCurrentPage: {
          type: 'string',
          errorMessage: ' 字段必须为 string 类型'
        },
        shareParams: {
          type: 'string',
          errorMessage: ' 字段必须为 string 类型'
        },
        shareUrl: {
          type: 'string',
          errorMessage: ' 字段必须为 string 类型'
        }
      },
      errorMessage: {
        type: " 字段类型必须为 'object'"
      }
    },
    deviceTypeList: {
      type: 'array',
      items: {
        type: 'string',
        errorMessage: {
          type: " 字段类型必须为 'string'"
        }
      },
      errorMessage: ' 字段必须为 array 类型'
    }
  },
  errorMessage: {
    type: ' 类型必须为 object',
    required:
      "必须包含 'package'、'name'、'versionName'、'versionCode'、'minPlatformVersion'、'icon'、'pages' 字段"
  }
}
