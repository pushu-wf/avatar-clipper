import { CommandAdapt } from "./CommandAdapt";

// 通过CommandAdapt中转避免直接暴露编辑器上下文
export class Command {
	// 清空图片
	public clearImage: CommandAdapt["clearImage"];
	// 重置
	public reset: CommandAdapt["reset"];
	// 销毁组件
	public destroy: CommandAdapt["destroy"];
	// 设置图片源
	public setImage: CommandAdapt["setImage"];
	// 设置图片属性 - 缩放 平移 旋转
	public updateImageAttrs: CommandAdapt["updateImageAttrs"];
	// 获取图片属性 - 缩放 平移 旋转
	public getImageAttrs: CommandAdapt["getImageAttrs"];
	// 设置裁剪框属性 - 宽高 位置坐标 不允许旋转
	public updateCropAttrs: CommandAdapt["updateCropAttrs"];
	// 获取裁剪框属性
	public getCropAttr: CommandAdapt["getCropAttr"];
	// 设置水印属性
	public updateWatermarkAttrs: CommandAdapt["updateWatermarkAttrs"];
	// 获取水印属性
	public getWatermarkAttr: CommandAdapt["getWatermarkAttr"];
	// 获取截图结果 - base64 | blob | canvas
	public getResult: CommandAdapt["getResult"];

	constructor(adapt: CommandAdapt) {
		this.clearImage = adapt.clearImage.bind(adapt);
		this.reset = adapt.reset.bind(adapt);
		this.destroy = adapt.destroy.bind(adapt);
		this.setImage = adapt.setImage.bind(adapt);
		this.updateImageAttrs = adapt.updateImageAttrs.bind(adapt);
		this.getImageAttrs = adapt.getImageAttrs.bind(adapt);
		this.updateCropAttrs = adapt.updateCropAttrs.bind(adapt);
		this.getCropAttr = adapt.getCropAttr.bind(adapt);
		this.updateWatermarkAttrs = adapt.updateWatermarkAttrs.bind(adapt);
		this.getWatermarkAttr = adapt.getWatermarkAttr.bind(adapt);
		this.getResult = adapt.getResult.bind(adapt);
	}
}
