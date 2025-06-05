import { CommandAdapt } from "./CommandAdapt";

// 通过CommandAdapt中转避免直接暴露编辑器上下文
export class Command {
	// 清空画布
	public clear: CommandAdapt["clear"];
	// 销毁组件
	public destroy: CommandAdapt["destroy"];
	// 设置图片源
	public setImage: CommandAdapt["setImage"];
	// 设置图片属性 - 缩放 平移 旋转
	public setImageAttr: CommandAdapt["setImageAttr"];
	// 获取图片属性 - 缩放 平移 旋转
	public getImageAttr: CommandAdapt["getImageAttr"];
	// 设置裁剪框属性 - 宽高 位置坐标 不允许旋转
	public setCropAttr: CommandAdapt["setCropAttr"];
	// 获取裁剪框属性
	public getCropAttr: CommandAdapt["getCropAttr"];
	// 设置水印属性
	public setWatermarkAttr: CommandAdapt["setWatermarkAttr"];
	// 获取水印属性
	public getWatermarkAttr: CommandAdapt["getWatermarkAttr"];
	// 获取截图结果 - base64 | blob | canvas
	public getResult: CommandAdapt["getResult"];
	constructor(adapt: CommandAdapt) {
		this.clear = adapt.clear.bind(adapt);
		this.destroy = adapt.destroy.bind(adapt);
		this.setImage = adapt.setImage.bind(adapt);
		this.setImageAttr = adapt.setImageAttr.bind(adapt);
		this.getImageAttr = adapt.getImageAttr.bind(adapt);
		this.setCropAttr = adapt.setCropAttr.bind(adapt);
		this.getCropAttr = adapt.getCropAttr.bind(adapt);
		this.setWatermarkAttr = adapt.setWatermarkAttr.bind(adapt);
		this.getWatermarkAttr = adapt.getWatermarkAttr.bind(adapt);
		this.getResult = adapt.getResult.bind(adapt);
	}
}
