# 接口文件

## AvatarClipperConfig

```ts
// 初始化 AvatarClipper 配置对象
interface AvatarClipperConfig {
	container: string | HTMLElement; // 容器挂载元素 [必传]
	width?: number; // 容器宽度 [非必传] [默认 100%]
	height?: number; // 容器高度 [非必传] [默认 100%]
	backgroundColor?: string; // 容器背景 [非必传] [默认 transparent]

	// 图片属性
	image?: ImageAttrs;

	// 裁剪相关配置
	crop?: AllowUpdateCropAttrs;

	// 水印相关配置
	watermark?: AllowUpdateWatermarkAttrs;
}
```

## ImageAttrs

```ts
// 图片属性
type ImageAttrs = {
	src?: string | Blob; // 图片地址 [非必传]
	/**
	 * 图片如何去适应指定容器的高度与宽度
	 * 	1. contain 保持原有尺寸比例。内容被缩放。 [默认]
	 * 	2. fill	不保证保持原有的比例，内容拉伸填充整个内容容器。
	 * 	3. cover 保持原有尺寸比例。但部分内容可能被剪切。
	 */
	objectFit?: "contain" | "cover" | "fill";
	width?: number; // 图片宽度
	height?: number; // 图片高度
	x?: number; // 图片x轴坐标
	y?: number; // 图片y轴坐标
	scaleX?: number;
	scaleY?: number;
	rotation?: number; // 图片旋转角度
	draggable?: boolean; // 图片是否可拖动
	zoom?: boolean; // 图片是否可缩放
};
```

## AllowUpdateImageAttrs

```ts
// 允许更新的图片属性
type AllowUpdateImageAttrs = Omit<ImageAttrs, "objectFit" | "src">;
```

## AllowUpdateCropAttrs

```ts
// 允许更新的裁剪框属性
type AllowUpdateCropAttrs = {
	x?: number; // 裁剪框x轴坐标
	y?: number; // 裁剪框y轴坐标
	width?: number; // 裁剪框宽度
	height?: number; // 裁剪框高度
	draggable?: boolean; // 裁剪框是否可拖动
	resize?: boolean; // 裁剪框是否可缩放
	fixed?: boolean; // 是否固定缩放比例
	fill?: string; // 裁剪框填充颜色
	stroke?: string; // 裁剪框边框颜色
};
```

## AllowUpdateWatermarkAttrs

```ts
// 允许更新的水印属性
type AllowUpdateWatermarkAttrs = {
	text?: string; // 水印文字
	fontSize?: number; // 水印文字大小
	color?: string; // 水印文字颜色
	gap?: [number, number]; // 水印间距 [x y]
	rotation?: number; // 旋转角度
};
```
