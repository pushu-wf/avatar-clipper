import { CommandAdapt } from "./CommandAdapt";

// 通过CommandAdapt中转避免直接暴露编辑器上下文
export class Command {
	// ✅️ 清空图片
	public clearImage: CommandAdapt["clearImage"];

	// ✅️ 重置
	public reset: CommandAdapt["reset"];

	// ✅️ 销毁组件
	public destroy: CommandAdapt["destroy"];

	// ✅️ 更新配置项
	public updateClipperOptions: CommandAdapt["updateClipperOptions"];

	// ✅️ 设置图片源
	public setImage: CommandAdapt["setImage"];

	// ✅️ 更新图片属性
	public updateImageAttrs: CommandAdapt["updateImageAttrs"];

	// ✅️ 获取图片属性
	public getImageAttrs: CommandAdapt["getImageAttrs"];

	// ✅️ 更新裁剪框属性
	public updateCropAttrs: CommandAdapt["updateCropAttrs"];

	// ✅️ 设置水印属性
	public updateWatermarkAttrs: CommandAdapt["updateWatermarkAttrs"];

	// ✅️ 获取截图结果
	public getResult: CommandAdapt["getResult"];

	constructor(adapt: CommandAdapt) {
		this.clearImage = adapt.clearImage.bind(adapt);
		this.reset = adapt.reset.bind(adapt);
		this.destroy = adapt.destroy.bind(adapt);
		this.updateClipperOptions = adapt.updateClipperOptions.bind(adapt);
		this.setImage = adapt.setImage.bind(adapt);
		this.getImageAttrs = adapt.getImageAttrs.bind(adapt);
		this.updateImageAttrs = adapt.updateImageAttrs.bind(adapt);
		this.updateCropAttrs = adapt.updateCropAttrs.bind(adapt);
		this.updateWatermarkAttrs = adapt.updateWatermarkAttrs.bind(adapt);
		this.getResult = adapt.getResult.bind(adapt);
	}
}
