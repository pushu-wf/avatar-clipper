import { Draw } from "../draw";
import { store } from "../store";
import { mergeOptions } from "../utils";
import { cropInfo, watermarkInfo } from "../interface";
import { generateWatermark, getCropInfo } from "../utils/konva";

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
	public setImageAttr() {}

	// 获取图片属性 - 缩放 平移 旋转
	public getImageAttr() {}

	// 设置裁剪框属性 - 宽高 位置坐标 不允许旋转
	public setCropAttr() {}

	// 获取裁剪框属性
	public getCropAttr(): cropInfo | undefined {
		return getCropInfo(this.draw.getStage());
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
	public getResult() {}
}
