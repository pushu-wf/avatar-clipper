import { Draw } from "../draw";
import { store } from "../store";
import { mergeOptions } from "../utils";
import { AllowUpdateCropAttrs, AllowUpdateImageAttrs, AllowUpdateWatermarkAttrs, ImageAttrs } from "../interface";

export class CommandAdapt {
	constructor(private draw: Draw) {}

	private checkDestroy() {
		if (this.draw.getIsDestroy()) console.error("AvatarClipper: 组件已销毁！");
		return this.draw.getIsDestroy();
	}
	// 清空画布 - 只需要清空图片层即可，裁剪框不可清除
	public clearImage() {
		if (this.checkDestroy()) return;

		this.draw.getEventResponder().clearImage();
	}

	// 重置 - 清空画布 + 恢复默认配置
	public reset() {
		if (this.checkDestroy()) return;

		this.draw.getEventResponder().reset();
	}

	// 销毁组件
	public destroy() {
		if (this.checkDestroy()) return;

		this.draw.destroy();
	}

	// 设置背景颜色
	public setBackgroundColor(color: string) {
		if (this.checkDestroy()) return;

		store.setState("backgroundColor", color);
		this.draw.getEventResponder().setBackgroundColor(color);
	}

	// 设置图片源
	public setImage(image: string | Blob) {
		if (this.checkDestroy()) return;

		// 合并到 store 中
		const imageAttrs = mergeOptions(store.getState("image"), { src: image });
		store.setState("image", imageAttrs);
		this.draw.getEventResponder().setImage(image);
	}

	// 设置图片属性 - 缩放 平移 旋转 位置 宽高 可拖拽 可缩放
	public updateImageAttrs(payload: AllowUpdateImageAttrs) {
		if (this.checkDestroy()) return;

		// 针对可更新属性进行 store 合并
		const imageAttrs = mergeOptions(store.getState("image"), payload);
		store.setState("image", imageAttrs);

		// 调用更新属性方法
		this.draw.getEventResponder().updateImageAttrs(payload);
	}

	// 获取图片属性
	public getImageAttrs(): ImageAttrs {
		if (this.checkDestroy()) return {};

		const imageAttrs = store.getState("image");
		return imageAttrs!;
	}

	// 设置裁剪框属性 - 宽高 位置坐标 不允许旋转
	public updateCropAttrs(payload: AllowUpdateCropAttrs) {
		if (this.checkDestroy()) return;

		// 做合并
		const crop = mergeOptions(store.getState("crop"), payload);
		store.setState("crop", crop);

		// 调用更新属性方法
		this.draw.getEventResponder().updateCropAttrs(payload);
	}

	// 设置水印属性
	public updateWatermarkAttrs(payload: AllowUpdateWatermarkAttrs) {
		if (this.checkDestroy()) return;

		// 做合并
		const watermark = mergeOptions(store.getState("watermark"), payload);
		store.setState("watermark", watermark);

		// 重新生成水印
		this.draw.getEventResponder().updateWatermark(payload.rotation);
	}

	// 获取截图结果 - string | blob | canvas
	public getResult(type: "string" | "blob" | "canvas", pixelRatio = 1, mimeType: "png" | "jpeg" = "png") {
		if (this.checkDestroy()) return;
		return this.draw.getEventResponder().getResult(type, pixelRatio, mimeType);
	}
}
