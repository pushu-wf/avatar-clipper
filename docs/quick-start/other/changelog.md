# 更新日志

<backTop />

## 🎉 0.0.8

-   更新 `AvatarClipperConfig` 接口，新增 `customMenus` 属性，用于自定义右键菜单；
-   更新 `AvatarClipperConfig` 接口，新增 `hideDefaultMenus` 属性，用于隐藏默认菜单；

## 🎉 0.0.7

-   `AvatarClipperConfig` 新增 `enableContextmenu` 属性，用于控制是否启用右键菜单；
-   删除 `setBackgroundColor` 命令；
-   新增 `updateClipperOptions` 实现配置项更新；
-   新增 `AllowUpdateClipperOptions` 接口，用于更新配置项；
-   实现右键菜单，默认提供 `上传` `下载` `清空` 快捷操作。

## 🎉 0.0.6

-   优化水印生成方法，从多个 `Konva.Text` 转为 `SceneFunc` 实现，提高绘制性能及规避水印堆叠、拖拽卡顿等问题；

## 🎉 0.0.4

-   优化主页文档测试用例；
-   优化代码结构，提高可维护性和可扩展性；
-   优化 `destroy` 方法，兼容容器销毁后的异常处理；
-   优化 `updateImageAttrs` 方法中针对图片缩放的异常处理；
-   重构 `CommandAdapt` 模块，新增 `executeCommand` 对象方法调用；
-   优化 `afterInit` 初始化完成后，一并触发 `preview` 事件，以实现首次初始化操作。

## 🎉 0.0.3

-   增加 `updateCropAttrs` 更新裁剪框属性方法；
-   完善 `README.md`，新增效果展示、共创计划等章节；
-   修复 `reset` 事件中，mergeOptions 引用错误问题；
-   优化 `updateImageAttrs` 方法，增加图片属性更新事件；
-   优化 `updateWatermarkAttrs` 方法，增加水印属性更新事件；
-   优化 `imageLoaded` 图片加载完成事件，一并触发 `imageUpdate` 更新事件。

## 🎉 0.0.2

-   优化相关模块结构，完善相关文档。

## 🎉 0.0.1

-   完成 Avatar-Clipper 基本结构搭建、功能模块抽离、单元测试工作。
