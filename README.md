<p align="center">
    <img src="/public/logo.svg"/>
</p>

---

# avatar-clipper 轻量级头像裁剪工具

avatar-clipper 是一款基于 Konva 开发的轻量级头像裁剪工具，主打 TypeScript 支持和移动端兼容性。其核心架构采用 Command 和 EventBus 模块，提供简洁 API 操作和灵活的事件回调机制。工具支持图片加载、裁剪框交互、水印添加、暗部效果等特色功能，并能导出多种格式的裁剪结果。相比现有方案，avatar-clipper 在保持功能完整的同时更加轻量化，不绑定任何 UI 组件，仅通过 API 实现核心裁剪功能，适用于社交媒体、电商等多场景需求。

## 在线体验

[stackblitz](https://stackblitz.com/~/github.com/pushu-wf/avatar-clipper)

⚠️ 温馨提示：如果打开后卡在 依赖下载 部分，请自行执行 `pnpm i` 命令，等待下载完成后，执行 `pnpm dev` 命令即可查看效果。

<p align="center">
    <img src="/public/stackblitz.png"/>
</p>

## 效果演示

<p align="center">
    <img src="/public/result.gif"/>
</p>

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
