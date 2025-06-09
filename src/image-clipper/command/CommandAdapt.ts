import { Draw } from "../draw";
import { store } from "../store";
import { mergeOptions } from "../utils";
import { generateWatermark } from "../utils/konva";
import { AllowUpdateCropAttrs, AllowUpdateImageAttrs, AllowUpdateWatermarkAttrs, ImageClipperConfig } from "../interface";

export class CommandAdapt {
	constructor(private draw: Draw) {}
	// 清空画布 - 只需要清空图片层即可，裁剪框不可清除
	public clearImage() {
		this.draw.getLayerController().clearImage();
	}

	// 重置 - 清空画布 + 恢复默认配置
	public reset() {
		this.clearImage();
	}

	// 销毁组件
	public destroy() {
		this.draw.getEventResponder().destroy();
	}

	// 设置图片源
	public setImage(image: string | Blob) {
		this.draw.getEventResponder().setImage(image);
	}

	// 设置图片属性 - 缩放 平移 旋转 位置 宽高 可拖拽 可缩放
	public updateImageAttrs(payload: AllowUpdateImageAttrs) {
		// 针对可更新属性进行 store 合并
		const imageAttrs = mergeOptions(store.getState("image"), payload);
		store.setState("image", imageAttrs);

		// 调用更新属性方法
		this.draw.getEventResponder().updateImageAttrs(payload);
	}

	// 获取图片属性 - 缩放 平移 旋转
	public getImageAttrs(): ImageClipperConfig["image"] {
		// 这里不能直接返回 store 的属性，刚初始化时，其他属性都为空，会导致属性为 undefined
	}

	// 设置裁剪框属性 - 宽高 位置坐标 不允许旋转
	public updateCropAttrs(payload: AllowUpdateCropAttrs) {
		// // 做合并
		// const crop = mergeOptions(store.getState("crop"), info);
		// store.setState("crop", crop);
		// this.draw.render();
	}

	// 获取裁剪框属性
	public getCropAttr(): ImageClipperConfig["crop"] {
		return store.getState("crop");
	}

	// 设置水印属性
	public updateWatermarkAttrs(info: AllowUpdateWatermarkAttrs) {
		// 做合并
		const watermark = mergeOptions(store.getState("watermark"), info);
		store.setState("watermark", watermark);

		// 重新生成水印
		this.draw.getEventResponder().updateWatermark();
	}

	// 获取水印属性
	public getWatermarkAttr(): ImageClipperConfig["watermark"] | undefined {
		return store.getState("watermark");
	}

	// 获取截图结果 - string | blob | canvas
	public getResult(type: "string" | "blob" | "canvas", pixelRatio = 1) {
		return this.draw.getEventResponder().getResult(type, pixelRatio);
	}
}
