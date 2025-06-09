# Image-Clipper 轻量级图片裁剪工具

https://github.xyxiao.cn/vue-cropper/docs/vue2.html

<!-- 基本结构 -->

```ts
// 属性设置
interface ImageClipperConfig {
	container: string | HTMLElement; // 容器挂载元素 [必传]
	width?: number; // 容器宽度 [非必传] [默认 100%]
	height?: number; // 容器高度 [非必传] [默认 100%]
	backgroundColor?: string; // 容器背景 [非必传] [默认 transparent]

	// 图片属性
	image?: {
		src?: string | Blob | HTMLImageElement; // 图片地址 [非必传]
		pixelRatio?: number; //像素比 [非必传] [默认 1]
		outputType?: "jpeg" | "png" | "webp"; //	裁剪生成图片的格式	jpg (jpg 需要传入jpeg)	jpeg, png, webp
		imageCover?: "contain" | "cover" | "fill" | "auto"; // 图片的缩放模式
		draggable?: boolean; // 图片是否可拖动
		zoom?: boolean; // 图片是否可缩放
	};

	// 裁剪相关配置
	crop?: {
		width?: number; // 裁剪框宽度
		height?: number; // 裁剪框高度
		x?: number; // 裁剪框x轴坐标
		y?: number; // 裁剪框y轴坐标
		draggable?: boolean; // 裁剪框是否可拖动
		resize?: boolean; // 裁剪框是否可缩放
		fixed?: boolean; // 是否固定缩放比例
	};

	// 水印相关配置
	watermark?: {
		text?: string; // 水印文字
		font?: string; // 水印文字样式
		// 疏密程度
		density?: number;
		// 旋转角度
		rotate?: number;
	};
}

// 事件回调
interface EventBusMap {
	// 图片加载完成事件
	imageLoaded: () => void;

	// 图片加载失败事件
	imageError: () => void;

	// 图片更新事件 缩放 平移 旋转 （针对返回属性即可）
	imageUpdate: () => void;

	// 裁剪框更新事件 缩放 平移 （针对返回属性即可）
	cropUpdate: () => void;

	// 预览
	preview: () => void;
}

// 可执行方法 command
interface CommandAdapter {
	// 清空画布
	clear(): void;
	// 销毁组件
	destroy(): void;

	// 设置图片源
	setImage: (source: string | Blob | HTMLImageElement) => void;
	// 设置图片属性 - 缩放 平移 旋转
	updateImageAttrs: (attr: ImageAttr) => void;
	// 获取图片属性 - 缩放 平移 旋转
	getImageAttrs: () => ImageAttr;

	// 设置裁剪框属性 - 宽高 位置坐标 不允许旋转
	updateCropAttrs: (attr: CropAttr) => void;
	// 获取裁剪框属性
	getCropAttr: () => CropAttr;

	// 设置水印属性
	updateWatermarkAttrs: (attr: WatermarkAttr) => void;
	// 获取水印属性
	getWatermarkAttr: () => WatermarkAttr;

	// 获取截图结果 - base64 | blob | canvas
	getResult: (type: "base64" | "blob" | "canvas", pixelRatio: number = 1) => Promise<string | Blob | HTMLCanvasElement>;
}
```

## 跨域图片请求须知

```ts
// 创建新的图片实例
const imageElement = new Image();

// 解析 source 资源
const source = await parseImageSource(image);
// 增加跨域处理 crossOrigin = Anonymous
imageElement.crossOrigin = "Anonymous";
imageElement.src = source;
```

本实例在创建图片时，已增加跨域兼容，仅当请求的域具有允许共享请求的 Access-Control-Allow-Origin 标头时，此方法才有效。但是不适用于所有情况，如果它不起作用，那么你必须以不同的方式配置你的服务器（它超出了 Konva 的范围），或者你可以尝试将图像存储在支持 CORS 请求的其他位置。

可用以下的方法来解决跨域问题：

```ts
// 远程图片实现方案：
const fetchURL = fetch(url, { method: "GET" });
// 将获取到的图片数据转换成图片对象，进而转成 base64
const image = await fetchURL.then((res) => res.blob());
// 进而设置图片资源
clipper.setImage(image);
```
