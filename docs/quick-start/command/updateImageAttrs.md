# updateImageAttrs

<backTop />

## 描述

更新图片属性

## 用法

```ts
clipper.command.updateImageAttrs(payload: AllowUpdateImageAttrs);
```

## 参数

```ts
// ⚠️ 源码中的写法：
// ⚠️ type AllowUpdateImageAttrs = Omit<ImageAttrs, "objectFit" | "src">;
type AllowUpdateImageAttrs = {
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

::: details 图片属性类型

```ts
type ImageAttrs = {
	src?: string | Blob; // 图片地址
	objectFit?: "contain" | "cover" | "fill"; // 图片填充模式
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

:::

## 返回值

--

## 示例

<img src='/public/logo.svg'/>
