<p align="center">
    <img src="/public/logo.svg"/>
</p>

---

# Avatar-Clipper 轻量级头像裁剪工具

avatar-clipper 是一款基于 Konva 开发的轻量级头像裁剪工具，主打 TypeScript 支持和移动端兼容性。其核心架构采用 Command 和 EventBus 模块，提供简洁 API 操作和灵活的事件回调机制。工具支持图片加载、裁剪框交互、水印添加、暗部效果等特色功能，并能导出多种格式的裁剪结果。相比现有方案，avatar-clipper 在保持功能完整的同时更加轻量化，不绑定任何 UI 组件，仅通过 API 实现核心裁剪功能，适用于社交媒体、电商等多场景需求。

---

**效果展示**

<p align="center">
    <img src="/public/result.gif"/>
</p>

## 在线体验

[📖 官方文档](https://pushu-wf.github.io/)

[🎉 官网体验地址](https://pushu-wf.github.io/quick-start/online/)

[🔗 备用地址: stackblitz](https://stackblitz.com/~/github.com/pushu-wf/avatar-clipper)

## Event 事件中心

| 事件名                      |       说明       |                 返回值 |
| --------------------------- | :--------------: | ---------------------: |
| [afterInit](#afterinit)     |  容器初始化完成  | 初始化完成时的裁剪结果 |
| [imageLoaded](#imageloaded) | 设置图片加载完成 |               图片属性 |
| [imageError](#imageerror)   | 图片设置失败回调 |               失败原因 |
| [imageUpdate](#imageupdate) |   图片更新回调   |               图片属性 |
| [preview](#preview)         |     实时预览     |       预览结果(string) |

## Command 命令中心

| 命令                                          |      说明      |                                           返回值 |
| --------------------------------------------- | :------------: | -----------------------------------------------: |
| [clearImage](#clearimage)                     |    清空图片    |                                               无 |
| [reset](#reset)                               |    重置组件    |                                               无 |
| [destroy](#destroy)                           |    销毁组件    |                                               无 |
| [getImageAttrs](#getimageattrs)               |  获取图片属性  | [ImageAttrs](/quick-start/interface/#imageattrs) |
| [getResult](#getresult)                       |  获取截图结果  |              string \| Blob \| HTMLCanvasElement |
| [setBackgroundColor](#setbackgroundcolor)     |  设置背景颜色  |                                               无 |
| [setImage](#setimage)                         |    设置图片    |                                               无 |
| [updateCropAttrs](#updatecropattrs)           | 更新裁剪框属性 |                                               无 |
| [updateImageAttrs](#updateimageattrs)         |  更新图片属性  |                                               无 |
| [updateWatermarkAttrs](#updatewatermarkattrs) |  更新水印属性  |                                               无 |

## 背景图片操作指引

1. 平移 `滚轮 (上下移动)` `滚轮 + Shift (左右移动)`
2. 缩放 `滚轮 + Ctrl (放大缩小)`
3. 拖动 `拖动 (上下左右)`

## 跨域图片请求须知

```ts
// Konva Image 图片创建跨域处理
const imageElement = new Image();

// 解析 source 资源
const source = await parseImageSource(image);

// 增加跨域处理 crossOrigin = Anonymous
imageElement.crossOrigin = "Anonymous";

// 设置图片源
imageElement.src = source;
```

本实例在创建图片时，已增加跨域兼容，仅当请求的域具有允许共享请求的 Access-Control-Allow-Origin 标头时，此方法才有效。如果它不起作用，那么你必须以不同的方式配置你的服务器（它超出了 Konva 的范围），或者你可以尝试将图像存储在支持 CORS 请求的其他位置。

可用以下的方法来解决跨域问题：

```ts
// 远程图片实现方案：
const fetchURL = fetch(url, { method: "GET" });
// 将获取到的图片数据转换成图片对象，进而转成 base64
const image = await fetchURL.then((res) => res.blob());
// 进而设置图片资源
clipper.setImage(image);
```

## 共创计划

1. 欢迎大家 提 [issue](https://gitee.com/wfeng0/avatar-clipper/issues/new);
2. 欢迎大家 提 [PR](https://gitee.com/wfeng0/avatar-clipper/pulls/new)，欢迎大家 fork 项目；
3. 欢迎大家加入讨论群：

<img src='/public/qq-group.png'/>
