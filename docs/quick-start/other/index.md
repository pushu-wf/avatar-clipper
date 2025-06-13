# 其他说明

<backTop />

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
