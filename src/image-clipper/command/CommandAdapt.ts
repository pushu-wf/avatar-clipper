import { Draw } from "../draw";
import { store } from "../store";
import { mergeOptions } from "../utils";
import { generateWatermark } from "../utils/konva";
import { ImageClipperConfig, watermarkInfo } from "../interface";

export class CommandAdapt {
	constructor(private draw: Draw) {}
	// 清空画布 - 只需要清空图片层即可，裁剪框不可清除
	public clear() {}

	// 销毁组件
	public destroy() {
		this.draw.destroy();
	}

	// 设置图片源
	public setImage(image: string | Blob) {
		this.draw.addImage(image);
	}

	// 设置图片属性 - 缩放 平移 旋转
	public setImageAttr(info: Partial<ImageClipperConfig["image"]>) {
		// 做合并
		const image = mergeOptions(store.getState("image"), info);
		store.setState("image", image);
		// 更新图片属性
		this.draw.handleImageAdaptive();
		this.draw.render();
	}

	// 获取图片属性 - 缩放 平移 旋转
	public getImageAttr(): ImageClipperConfig["image"] {
		return store.getState("image");
	}

	// 设置裁剪框属性 - 宽高 位置坐标 不允许旋转
	public setCropAttr(info: Partial<ImageClipperConfig["crop"]>) {
		// 做合并
		const crop = mergeOptions(store.getState("crop"), info);
		store.setState("crop", crop);
		this.draw.render();
	}

	// 获取裁剪框属性
	public getCropAttr(): ImageClipperConfig["crop"] {
		return store.getState("crop");
	}

	// 设置水印属性
	public setWatermarkAttr(info: Partial<watermarkInfo>) {
		// 做合并
		const watermark = mergeOptions(store.getState("watermark"), info);
		store.setState("watermark", watermark);

		// 重新生成水印
		const stage = this.draw.getStage();
		if (!stage) return;
		generateWatermark(stage);
		this.draw.render();
	}

	// 获取水印属性
	public getWatermarkAttr(): watermarkInfo | undefined {
		return store.getState("watermark");
	}

	// 获取截图结果 - base64 | blob | canvas
	public getResult(type: "base64" | "blob" | "canvas") {
		console.log(" ==> getResult ", type);
	}
}
