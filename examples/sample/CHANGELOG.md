# v1.3.0

此版本配套快应用平台版本为 v1030

## 框架

- 在 app.ux 中新增全局错误监听示例

## 组件

- 为 input 组件和 textarea 组件新增 selectionchange 事件示例
- 为 image 组件增加 complete, error 事件示例
- 为 video 组件增加 muted 属性示例
- 为 tab-content 组件增加 scrollable 属性示例
- 为 audio 组件增加 stop 方法示例
- 新增 animation API 示例

## 接口

- 新增在创建图标的对话框中自定义提示信息示例
- 新增短时振动示例
- 为 WebSocket 新增支持 ArrayBuffer 示例

## 样式

- 新增 font-family, font-face 示例
- 新增 jusify-content: space-around 示例
- background-image 支持网络图片地址

# v1.0.2

此版本配套快应用平台版本为 v1020

## 组件

- 新增 map 组件
- 新增 canvas 组件
- web 组件支持文件下载能力
- web 组件支持通信能力

## 接口

- 新增 wifi 接口
- shortcut 接口允许开启和禁止快应用平台创建快捷方式的弹窗提示

# v1.0.1

此版本配套快应用平台版本为 v1010

## 框架

1、新增$app.exit与$page.finish 方法，退出应用/页面

## 组件

1、input 增加 maxLength 属性
2、swiper 增加 loop 开关
3、Promise 化接口请求操作
4、文本编辑类组件增加 selection 能力
5、list 组件 scroll 事件参数增加 scrollState
6、video 组件新增 controls 属性，控制是否显示播放控件
7、首页及 input 组件页新增 active 伪类样式
8、div 组件新增 justify-content, align-items, align-self 样式的 demo
9、audio 新增控制音频播放通知显隐的 demo
10、新增 multi-picker 组件，支持多列选择器

## 接口

1、新增本地文件读写接口 demo
2、新增选择本地文件接口 demo
3、新增保存图片、视频到相册 demo
4、新增微信帐号接口、QQ 帐号接口、微博帐号接口 demo
5、新增第三方分享指定渠道 demo
6、新增 fetch 对 contenttype 的处理 demo
7、新增联系人接口 demo
8、新增发送短信接口 demo
9、地理位置增加获取系统当前支持的定位类型的能力
10、扩展 record 接口，支持设置录音时长，采样率，录音通道数，编码码率以及音频格式
11、下载文件时(request.download)可指定 description、filename
12、router 接口可直接打开指定快应用

## 样式动画

1、新增 background-image 支持.9 图 demo
2、新增背景图片支持 background-position 的 demo
3、新增 translate 支持百分比 demo
