import { Draw } from "../draw";

export class CommandAdapt {
	constructor(private draw: Draw) {}
	// 清空画布
	public clear() {}
	// 销毁组件
	public destroy() {}
	// 设置图片源
	public setImage() {}
	// 设置图片属性 - 缩放 平移 旋转
	public setImageAttr() {}
	// 获取图片属性 - 缩放 平移 旋转
	public getImageAttr() {}
	// 设置裁剪框属性 - 宽高 位置坐标 不允许旋转
	public setCropAttr() {}
	// 获取裁剪框属性
	public getCropAttr() {}
	// 设置水印属性
	public setWatermarkAttr() {}
	// 获取水印属性
	public getWatermarkAttr() {}
	// 获取截图结果 - base64 | blob | canvas
	public getResult() {}
}
