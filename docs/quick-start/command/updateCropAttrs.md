# updateCropAttrs

<backTop />

## 描述

更新裁剪框属性

## 用法

```ts
clipper.command.updateCropAttrs(payload: AllowUpdateCropAttrs);
```

## 参数

```ts
interface AllowUpdateCropAttrs {
	x?: number; // 裁剪框x轴坐标
	y?: number; // 裁剪框y轴坐标
	width?: number; // 裁剪框宽度
	height?: number; // 裁剪框高度
	draggable?: boolean; // 裁剪框是否可拖动
	resize?: boolean; // 裁剪框是否可缩放
	fixed?: boolean; // 是否固定缩放比例
	fill?: string; // 裁剪框填充颜色
	stroke?: string; // 裁剪框边框颜色
}
```

## 返回值

--

## 示例

<img src='/public/logo.svg'/>
