# updateWatermarkAttrs

<backTop />

## 描述

更新水印属性

## 用法

```ts
clipper.command.updateWatermarkAttrs(payload: AllowUpdateWatermarkAttrs);
```

## 参数

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

## 返回值

--

## 示例

<img src='/public/logo.svg'/>
