# imageUpdate

<backTop />

## 描述

图片更新事件

## 用法

```ts
clipper.event.on("imageUpdate", (imageAttrs: ImageAttrs) => {});
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

<img src='/public/image-update-result.gif'/>
