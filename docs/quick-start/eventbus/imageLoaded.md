# imageLoaded

<backTop />

## 描述

图片加载完成，可获取图片初始数据。

::: tip 提示
图片加载完成后，图片数据已获取，此时可进行图片操作。
使用场景如下：

1. 获取图片初始化后的缩放比例，以实现 command 丝滑缩放效果；
2. 获取图片初始化后的图片位置，以实现 command 丝滑移动效果；

:::

::: warning 温馨提示
`imageLoaded` 当且仅当图片加载完成后执行，为了实时获取更新的图片信息，建议使用 `imageUpdate` 事件代替。
每一次 `imageLoaded` 事件被触发，也会同步触发 `imageUpdate` 事件。
:::

::: details ✅️ 用法示例：

```ts
/**
 * 定义图片的基础属性,用于后期变换使用
 */
const imageAttrs = { scaleX: 1, scaleY: 1, rotation: 0 };

// 监听  imageLoaded 事件,初始化图片参数
// [!code error]
clipper.event.on("imageLoaded", (attrs) => {
	// [!code error]
	imageAttrs.scaleX = attrs.scaleX!;
	// [!code error]
	imageAttrs.scaleY = attrs.scaleY!;
	// [!code error]
	imageAttrs.rotation = attrs.rotation!;
	// [!code error]
});
// [!code error]
// ⚠️ 请注意：如果使用 imageLoaded 事件，则手动缩放图片时，imageAttrs的缩放比例不会变化，需要自行维护。

// [!code ++]
// 建议使用 imageUpdate 事件
// [!code ++]
clipper.event.on("imageUpdate", (attrs) => {
	// [!code ++]
	imageAttrs.scaleX = attrs.scaleX!;
	// [!code ++]
	imageAttrs.scaleY = attrs.scaleY!;
	// [!code ++]
	imageAttrs.rotation = attrs.rotation!;
	// [!code ++]
});
/** 缩小图片 **/
function reduce() {
	clipper.command.updateImageAttrs({ scaleX: imageAttrs.scaleX - scaleStep, scaleY: imageAttrs.scaleY - scaleStep });
}

/** 放大图片 **/
function enlarge() {
	clipper.command.updateImageAttrs({ scaleX: imageAttrs.scaleX + scaleStep, scaleY: imageAttrs.scaleY + scaleStep });
}
```

:::

## 用法

```ts
clipper.event.on("imageLoaded", (imageAttrs: imageAttrs) => {});
```

## 返回值

```ts
interface imageAttrs {
	src: string | Blob; // 图片地址
	objectFit: "contain" | "cover" | "fill"; // 图片自适应方式
	width: number; // 图片宽度
	height: number; // 图片高度
	x: number; // 图片x轴坐标
	y: number; // 图片y轴坐标
	scaleX: number;
	scaleY: number;
	rotation: number; // 图片旋转角度
	draggable: boolean; // 图片是否可拖动
	zoom: boolean; // 图片是否可缩放
}
```

## 示例

<img src='/public/image-loaded-result.gif'/>
