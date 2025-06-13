import { Draw } from "../draw";
import { store } from "../store";
import { mergeOptions } from "../utils";
import { EventResponder } from "../draw/EventResponder";
import { AllowUpdateCropAttrs, AllowUpdateImageAttrs, AllowUpdateWatermarkAttrs, ImageAttrs } from "../interface";

export class CommandAdapt {
	private eventResponder: EventResponder;
	constructor(private draw: Draw) {
		this.eventResponder = this.draw.getEventResponder();
	}

	private checkDestroy() {
		if (this.draw.getIsDestroy()) console.error("AvatarClipper: 组件已销毁！");
		return this.draw.getIsDestroy();
	}

	private executeCommand<T>(callback: () => T): T | undefined {
		if (this.checkDestroy()) return undefined;
		return callback();
	}

	// 清空画布 - 只需要清空图片层即可，裁剪框不可清除
	public clearImage() {
		this.executeCommand(() => {
			this.eventResponder.clearImage();
		});
	}

	// 重置 - 清空画布 + 恢复默认配置
	public reset() {
		this.executeCommand(() => {
			this.eventResponder.reset();
		});
	}

	// 销毁组件
	public destroy() {
		this.executeCommand(() => {
			this.draw.destroy();
		});
	}

	// 设置背景颜色
	public setBackgroundColor(color: string) {
		this.executeCommand(() => {
			store.setState("backgroundColor", color);
			this.eventResponder.setBackgroundColor(color);
		});
	}

	// 设置图片源
	public setImage(image: string | Blob) {
		return this.executeCommand(() => {
			// 合并到 store 中
			const imageAttrs = mergeOptions(store.getState("image"), { src: image });
			store.setState("image", imageAttrs);
			this.eventResponder.setImage(image);
			return imageAttrs;
		});
	}

	// 设置图片属性 - 缩放 平移 旋转 位置 宽高 可拖拽 可缩放
	public updateImageAttrs(payload: AllowUpdateImageAttrs) {
		return this.executeCommand(() => {
			// 针对可更新属性进行 store 合并
			const imageAttrs = mergeOptions(store.getState("image"), payload);
			store.setState("image", imageAttrs);

			// 调用更新属性方法
			this.eventResponder.updateImageAttrs(payload);
			return imageAttrs;
		});
	}

	// 获取图片属性
	public getImageAttrs(): ImageAttrs {
		return this.executeCommand(() => {
			const imageAttrs = store.getState("image");
			return imageAttrs!;
		}) as ImageAttrs;
	}

	// 设置裁剪框属性 - 宽高 位置坐标 不允许旋转
	public updateCropAttrs(payload: AllowUpdateCropAttrs) {
		return this.executeCommand(() => {
			// 做合并
			const crop = mergeOptions(store.getState("crop"), payload);
			store.setState("crop", crop);

			// 调用更新属性方法
			this.eventResponder.updateCropAttrs(payload);
			return crop;
		});
	}

	// 设置水印属性
	public updateWatermarkAttrs(payload: AllowUpdateWatermarkAttrs) {
		return this.executeCommand(() => {
			// 做合并
			const watermark = mergeOptions(store.getState("watermark"), payload);
			store.setState("watermark", watermark);

			// 重新生成水印
			this.eventResponder.updateWatermark(payload.rotation);
			return watermark;
		});
	}

	// 获取截图结果 - string | blob | canvas
	public getResult(type: "string" | "blob" | "canvas", pixelRatio = 1, mimeType: "png" | "jpeg" = "png") {
		return this.executeCommand(() => {
			return this.eventResponder.getResult(type, pixelRatio, mimeType);
		});
	}
}
