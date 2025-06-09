import { Draw } from "..";
import { store } from "../../store";
import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";
import { parseImageSource } from "../../utils";
import { AllowUpdateImageAttrs } from "../../interface";
import { Image as KonvaImage } from "konva/lib/shapes/Image";
import { base64ToBlob, generateWatermark, getCropInfo, isEmpty, rotateAroundCenter } from "../../utils/konva";

/**
 * 导出画布相应事件控制中心
 */
export class EventResponder {
	private stage: Stage;
	constructor(private draw: Draw) {
		this.stage = this.draw.getStage();
	}

	/**
	 * @description 渲染容器
	 */
	public render() {
		if (!this.stage) return;
		this.stage.batchDraw();
	}

	/**
	 * @description 清空图片
	 */
	public clearImage() {}

	/**
	 * @description 重置容器
	 */
	public reset() {}

	/**
	 * @description 销毁容器
	 */
	public destroy() {
		if (!this.stage) return;
		this.stage.destroy();
	}

	/**
	 * @description 清空画布 - 特指清空图片图层，并恢复裁剪框位置大小
	 */
	public clear() {
		if (!this.stage) return;
		this.render();
	}

	/**
	 * @description 设置图片源
	 * @param { string | Blob } image 图片实例
	 */
	public async setImage(image: string | Blob) {
		if (!this.stage) return;

		const mainLayer = <Layer>this.stage.findOne("#mainLayer");
		if (!mainLayer) return;

		// 判断当前layer 下是否已经存在图片资源
		const oldImage = mainLayer.findOne("#image");
		if (oldImage) oldImage.destroy();

		// 创建新的图片实例
		const imageElement = new Image();

		// 解析 source 资源
		const source = await parseImageSource(image);
		// 增加跨域处理 crossOrigin = Anonymous
		imageElement.crossOrigin = "Anonymous";
		imageElement.src = source;

		// 解析 eventbus 触发图片加载相关事件
		const imageClipper = this.draw.getImageClipper();

		// image onload
		imageElement.onload = this.handleImageAdaptive.bind(this, imageElement);

		// image error
		imageElement.onerror = () => imageClipper.event.dispatchEvent("imageError");
	}

	/**
	 * @description 图片加载完成事件
	 */
	private handleImageAdaptive(imageElement: HTMLImageElement) {
		if (!this.stage) return;

		const mainLayer = <Layer>this.stage.findOne("#mainLayer");
		if (!mainLayer) return;

		const { draggable = true, objectFit = "contain" } = store.getState("image") || {};

		// 创建 Konva.Image
		const konvaImage = new KonvaImage({
			id: "image",
			image: imageElement,
			draggable: draggable,
			listening: true,
		});

		mainLayer.add(konvaImage);
		// 一定要设置 zIndex，不然裁剪框无法在上层
		konvaImage.zIndex(0);

		// 设置 objectFit 模式(仅在初始化时做自适应即可，后续的缩放平移旋转操作，由用户自行处理)
		this.applyObjectFit(konvaImage, objectFit);

		// renderer
		this.render();

		// patch image loaded event
		const imageClipper = this.draw.getImageClipper();
		imageClipper.event.dispatchEvent("imageLoaded");

		// 图片加载完成后，需要立即初始化一个 preview
		this.patchPreviewEvent();
	}

	/**
	 * 根据 objectFit 类型应用不同的缩放策略
	 * @param konvaImage
	 * @param imageInfo
	 */
	private applyObjectFit(konvaImage: KonvaImage, objectFit: "contain" | "cover" | "fill" = "contain") {
		if (!this.stage) return;

		const stageSize = this.stage.getSize();
		if (!stageSize) return;

		const { width: containerWidth, height: containerHeight } = stageSize;
		const { width: originWidth, height: originHeight } = konvaImage.size();

		konvaImage.scale({ x: 1, y: 1 }); // 重置缩放

		if (objectFit === "contain") {
			// 等比缩放，确保完整显示
			const scale = Math.min(containerWidth / originWidth, containerHeight / originHeight);
			konvaImage.scale({ x: scale, y: scale });
		} else if (objectFit === "cover") {
			// 等比缩放，覆盖整个容器，可能被裁剪
			const scale = Math.max(containerWidth / originWidth, containerHeight / originHeight);
			konvaImage.scale({ x: scale, y: scale });
		} else if (objectFit === "fill") {
			// 拉伸填满，不保持比例
			konvaImage.width(containerWidth);
			konvaImage.height(containerHeight);
		}

		// 居中显示
		konvaImage.x((containerWidth - originWidth * konvaImage.scaleX()) / 2);
		konvaImage.y((containerHeight - originHeight * konvaImage.scaleY()) / 2);

		this.render();
	}

	/**
	 * @description 更新图片属性
	 */
	public updateImageAttrs(payload: AllowUpdateImageAttrs) {
		if (!this.stage) return;

		// 获取主图层和图像节点
		const mainLayer = this.stage.findOne("#mainLayer") as Layer;
		if (!mainLayer) return;

		const konvaImage = mainLayer.findOne("#image") as KonvaImage;

		if (!konvaImage) {
			console.error("ImageClipper: 未找到图片节点，请检查是否传递了 src 属性");
			return;
		}
		const { width, height, x, y, scaleX, scaleY, rotation, draggable } = payload;

		if (!isEmpty(x)) konvaImage.x(x);
		if (!isEmpty(y)) konvaImage.y(y);
		if (!isEmpty(width)) konvaImage.width(width);
		if (!isEmpty(height)) konvaImage.height(height);
		if (!isEmpty(scaleX)) konvaImage.scaleX(scaleX);
		if (!isEmpty(scaleY)) konvaImage.scaleY(scaleY);
		if (!isEmpty(rotation)) rotateAroundCenter(konvaImage, rotation!);
		if (!isEmpty(draggable)) konvaImage.draggable(draggable);

		this.render();
	}

	/**
	 * @description 更新水印属性
	 */
	public updateWatermark() {
		if (!this.stage) return;

		// 重新生成水印
		generateWatermark(this.stage);

		// 更新视图
		this.render();
	}

	/**
	 * @description 工具函数 - 触发 preview 事件
	 */
	public patchPreviewEvent() {
		const imageClipper = this.draw.getImageClipper();
		if (!imageClipper) return;

		const base64 = <string>this.getResult("string");
		if (!base64) return;

		imageClipper.event.dispatchEvent("preview", base64);
	}

	/**
	 * @description 获取裁剪结果
	 * @param { "string" | "blob" | "canvas" } type 裁剪结果类型
	 * @param { number } [pixelRatio] pixelRatio
	 * @param { "png" | "jpeg" } [mimeType] mimeType
	 */
	public getResult(type: "string" | "blob" | "canvas", pixelRatio = 1, mimeType: "png" | "jpeg" = "png") {
		console.time("getResult");
		if (!this.stage) return "Stage is not exist.";

		// 通过复制图层实现
		const stageClone = this.stage.clone();
		// 删除 transformer
		const mainLayer = <Layer>stageClone.findOne("#mainLayer");
		mainLayer.findOne("Transformer")?.remove();

		const cropAttrs = getCropInfo(this.stage);

		if (type === "canvas") {
			return stageClone.toCanvas({ ...cropAttrs, pixelRatio });
		}

		const base64String = stageClone.toDataURL({ ...cropAttrs, pixelRatio, mimeType: `image/${mimeType}` });

		stageClone.destroy();

		console.timeEnd("getResult");

		if (type === "string") {
			return base64String;
		} else if (type === "blob") {
			return base64ToBlob(base64String);
		}
	}
}
