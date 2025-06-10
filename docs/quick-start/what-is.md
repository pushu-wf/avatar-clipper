# 什么是 Image Clipper?

<backTop />

        Image-Clipper 是一款基于 Konva 开发的轻量级图片裁剪工具，主打 TypeScript 支持和移动端兼容性。其核心架构采用 Command 和 EventBus 模块，提供简洁 API 操作和灵活的事件回调机制。工具支持图片加载、裁剪框交互、水印添加、暗部效果等特色功能，并能导出多种格式的裁剪结果。相比现有方案，Image-Clipper 在保持功能完整的同时更加轻量化，不绑定任何 UI 组件，仅通过 API 实现核心裁剪功能，适用于社交媒体、电商等多场景需求。

## 现有的图片裁剪工具

1. [vue-cropper](https://github.com/xyxiao001/vue-cropper)
2. [vue-img-cutter](https://gitee.com/GLUESTICK/vue-img-cutter)
3. ...

## 为什么要使用 Image-Clipper

1. 轻量级，基于 Konva 构建，不绑定任何 UI 组件，仅通过 API 实现核心裁剪功能，适用于社交媒体、电商等多场景需求。
2. 原生支持 TypeScript，提供完整的类型提示，类型定义文件已内置，无需额外安装。
3. 移动端兼容性良好，支持移动端触控交互，可满足移动端裁剪需求。
4. 灵活的事件回调机制，可自定义事件处理逻辑，满足各种场景需求。
