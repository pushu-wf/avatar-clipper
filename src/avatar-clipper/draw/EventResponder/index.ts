import { Draw } from "..";
import { store } from "../../store";
import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";
import { Rect } from "konva/lib/shapes/Rect";
import { Transformer } from "konva/lib/shapes/Transformer";
import { Image as KonvaImage } from "konva/lib/shapes/Image";
import { getDefaultConfig, shapeIDMapConfig } from "../../config";
import { mergeOptions, parseImageSource, throttle } from "../../utils";
import { base64ToBlob, getCropInfo, handleCropPosition } from "../../utils/konva";
import { AllowUpdateClipperOptions, AllowUpdateCropAttrs, AllowUpdateImageAttrs } from "../../interface";
import { isEmpty, rotateAroundCenter, scaleAroundCenter, updateCropTransformerAttrs } from "../../utils/konva";

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
	 * 获取主图层
	 * @returns 主图层
	 */
	private getMainLayer(): Layer | null {
		if (!this.stage) return null;

		const mainLayer = this.stage.findOne(`#${shapeIDMapConfig.mainLayerID}`) as Layer;
		if (!mainLayer) {
			console.error("AvatarClipper: 未找到主图层，请检查后重试！");
			return null;
		}

		return mainLayer;
	}

	/**
	 * @description 清空图片
	 */
	public clearImage() {
		if (!this.stage) return;

		const mainLayer = this.getMainLayer();
		if (!mainLayer) return;

		const image = mainLayer.findOne(`#${shapeIDMapConfig.imageID}`) as KonvaImage;
		if (image) image.destroy();

		// 请不要重置为 undefind 不然 mergeOptions 会报错
		store.setState("image", {});

		this.render();
		this.patchPreviewEvent();
	}

	/**
	 * @description 重置容器
	 */
	public reset() {
		if (!this.stage) return;

		// 重新初始化容器
		const options = this.draw.getAvatarClipper().getOptions();
		// 合并用户传入 options 与默认配置，并存储到 store 中
		const stage = mergeOptions(getDefaultConfig(), options);

		// 替换 store
		store.replaceStage(stage);

		const layerManager = this.draw.getLayerManager();
		layerManager.clearLayers();
		layerManager.initLayers();

		// 清空后刷新
		this.patchPreviewEvent();
	}

	/**
	 * @description 更新 clipper 配置项
	 * @param options clipper 配置项
	 */
	public updateClipperOptions(options: AllowUpdateClipperOptions) {
		const { backgroundColor, enableContextmenu } = options;

		if (backgroundColor && !isEmpty(backgroundColor)) {
			store.setState("backgroundColor", backgroundColor);
			this.setBackgroundColor(backgroundColor);
		}

		if (!isEmpty(enableContextmenu)) {
			store.setState("enableContextmenu", enableContextmenu);
		}
	}

	/**
	 * @description 设置背景颜色
	 * @param color 背景颜色
	 */
	private setBackgroundColor(color: string) {
		if (!this.stage || !color) return;

		// 获取背景颜色 Rect
		const mainLayer = this.getMainLayer();
		if (!mainLayer) return;

		const backgroundRect = mainLayer.findOne(`#${shapeIDMapConfig.backgroundRectID}`) as Rect;
		if (!backgroundRect) {
			console.error("AvatarClipper: 未找到背景矩形，请检查后重试！");
			return;
		}
		backgroundRect.fill(color);

		this.render();

		this.patchPreviewEvent();
	}

	/**
	 * @description 设置图片源
	 * @param { string | Blob } image 图片实例
	 */
	public async setImage(image: string | Blob) {
		if (!this.stage || !image) return;

		const mainLayer = this.getMainLayer();
		if (!mainLayer) return;

		// 判断当前layer 下是否已经存在图片资源
		const oldImage = mainLayer.findOne(`#${shapeIDMapConfig.imageID}`);
		if (oldImage) oldImage.destroy();

		// 创建新的图片实例
		const imageElement = new Image();

		// 解析 source 资源
		const source = await parseImageSource(image);

		// 增加跨域处理 crossOrigin = Anonymous
		imageElement.crossOrigin = "Anonymous";
		imageElement.src = source;

		// 解析 eventbus 触发图片加载相关事件
		const AvatarClipper = this.draw.getAvatarClipper();

		// image onload
		imageElement.onload = this.handleImageAdaptive.bind(this, imageElement);

		// image error
		imageElement.onerror = (error) => AvatarClipper.event.dispatchEvent("imageError", error);
	}

	/**
	 * @description 图片加载完成事件
	 */
	private handleImageAdaptive(imageElement: HTMLImageElement) {
		if (!this.stage) return;

		const mainLayer = this.getMainLayer();
		if (!mainLayer) return;

		const { draggable = true, objectFit = "contain" } = store.getState("image") || {};

		// 创建 Konva.Image
		const konvaImage = new KonvaImage({
			id: shapeIDMapConfig.imageID,
			image: imageElement,
			draggable: draggable,
			listening: true,
		});

		mainLayer.add(konvaImage);
		// 一定要设置 zIndex，不然裁剪框无法在上层
		konvaImage.zIndex(1);

		// 监听事件
		konvaImage.on("dragmove", () => (this.patchImageUpdateEvent(), this.patchPreviewEvent()));

		// 设置 objectFit 模式(仅在初始化时做自适应即可，后续的缩放平移旋转操作，由用户自行处理)
		this.applyObjectFit(konvaImage, objectFit);

		// renderer
		this.render();

		// patch image loaded event
		const AvatarClipper = this.draw.getAvatarClipper();
		AvatarClipper.event.dispatchEvent("imageLoaded", store.getState("image"));

		// 同步触发 imageUpdate 事件
		this.patchImageUpdateEvent();

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

		// 等比缩放，确保完整显示
		if (objectFit === "contain") {
			const scale = Math.min(containerWidth / originWidth, containerHeight / originHeight);
			konvaImage.scale({ x: scale, y: scale });
		}
		// 等比缩放，覆盖整个容器，可能被裁剪
		else if (objectFit === "cover") {
			const scale = Math.max(containerWidth / originWidth, containerHeight / originHeight);
			konvaImage.scale({ x: scale, y: scale });
		}
		// 拉伸填满，不保持比例
		else if (objectFit === "fill") {
			konvaImage.width(containerWidth);
			konvaImage.height(containerHeight);
		}

		// 居中显示
		konvaImage.x((containerWidth - originWidth * konvaImage.scaleX()) / 2);
		konvaImage.y((containerHeight - originHeight * konvaImage.scaleY()) / 2);

		// 图片更新完成后，需要同步图片属性到 store 中
		const imageAttrs = {
			...store.getState("image"),
			x: konvaImage.x(),
			y: konvaImage.y(),
			width: konvaImage.width(),
			height: konvaImage.height(),
			scaleX: konvaImage.scaleX(),
			scaleY: konvaImage.scaleY(),
			rotation: konvaImage.rotation(),
		};

		store.setState("image", imageAttrs);

		this.render();
	}

	/**
	 * @description 更新图片属性
	 */
	public updateImageAttrs(payload: AllowUpdateImageAttrs) {
		if (!this.stage) return;

		const mainLayer = this.getMainLayer();
		if (!mainLayer) return;

		const konvaImage = mainLayer.findOne(`#${shapeIDMapConfig.imageID}`) as KonvaImage;

		if (!konvaImage) {
			console.error("AvatarClipper: 未找到图片节点，请检查是否传递了 src 属性");
			return;
		}
		const { width, height, x, y, scaleX, scaleY, rotation, draggable } = payload;

		if (!isEmpty(x)) konvaImage.x(x);
		if (!isEmpty(y)) konvaImage.y(y);
		if (!isEmpty(width)) konvaImage.width(width);
		if (!isEmpty(height)) konvaImage.height(height);

		// 缩放要基于图片中心缩放
		if (!isEmpty(scaleX) || !isEmpty(scaleY)) scaleAroundCenter(konvaImage, scaleX!, scaleY!);

		if (!isEmpty(rotation)) rotateAroundCenter(konvaImage, rotation!);
		if (!isEmpty(draggable)) konvaImage.draggable(draggable);

		this.render();

		// 触发image update 事件
		this.patchImageUpdateEvent();

		// 触发 preview 事件
		this.patchPreviewEvent();
	}

	/**
	 * @description 更新裁剪框属性
	 * @param payload
	 */
	public updateCropAttrs(payload: AllowUpdateCropAttrs) {
		if (!this.stage) return;

		// 获取裁剪框
		const cropLayer = this.stage.findOne(`#${shapeIDMapConfig.cropLayerID}`) as Layer;
		if (!cropLayer) return;

		const crop = cropLayer.findOne(`#${shapeIDMapConfig.cropRectID}`) as Rect;

		if (!crop) {
			console.error("AvatarClipper: 未找到裁剪框节点，请检查后重试！");
			return;
		}

		const cropTransformer = cropLayer.findOne(`#${shapeIDMapConfig.cropTransformerID}`) as Transformer;

		// 不然解析属性进行更新
		const { x, y, width, height, draggable } = payload;

		// 处理裁剪框位置关系
		handleCropPosition(crop, x, y, width, height);

		if (!isEmpty(draggable)) crop.draggable(draggable);

		// 处理形变控制器属性
		updateCropTransformerAttrs(cropTransformer);

		// 强制更新
		this.render();
	}

	/**
	 * @description 更新水印属性
	 */
	public updateWatermark(rotation?: number) {
		if (!this.stage) return;

		// 如果传入 rotation 则需要更新 watermarkLayer 的旋转角度
		if (!isEmpty(rotation)) {
			const watermarkLayer = this.stage.findOne(`#${shapeIDMapConfig.watermarkLayerID}`) as Layer;
			if (!watermarkLayer) {
				console.error("AvatarClipper: 未找到水印图层，请检查后重试！");
				return;
			}
			watermarkLayer.rotation(rotation);
		}

		// 更新视图
		this.render();

		// 触发 preview 事件
		this.patchPreviewEvent();
	}

	/**
	 * @description 工具函数 - 触发 preview 事件 节流触发！
	 */
	public patchPreviewEvent() {
		throttle(
			() =>
				requestAnimationFrame(() => {
					const AvatarClipper = this.draw.getAvatarClipper();
					if (!AvatarClipper) return;

					const base64 = <string>this.getResult("string");
					if (!base64) return;

					AvatarClipper.event.dispatchEvent("preview", base64);
				}),
			100
		)();
	}

	/**
	 * @description 工具函数 - 触发 imageUpdate 事件
	 */
	public patchImageUpdateEvent() {
		const AvatarClipper = this.draw.getAvatarClipper();
		AvatarClipper.event.dispatchEvent("imageUpdate", store.getState("image"));
	}

	/**
	 * @description 获取裁剪结果
	 * @param { "string" | "blob" | "canvas" } type 裁剪结果类型
	 * @param { number } [pixelRatio] pixelRatio
	 * @param { "png" | "jpeg" } [mimeType] mimeType
	 */
	public getResult(type: "string" | "blob" | "canvas", pixelRatio = 1, mimeType: "png" | "jpeg" = "png") {
		if (!this.stage) return "Stage is not exist.";

		// 通过复制图层实现
		const stageClone = this.stage.clone();

		// 删除 transformer
		const mainLayer = <Layer>stageClone.findOne(`#${shapeIDMapConfig.mainLayerID}`);
		if (!mainLayer) return;

		mainLayer.findOne("Transformer")?.remove();

		const cropAttrs = getCropInfo(this.stage);

		if (type === "canvas") {
			return stageClone.toCanvas({ ...cropAttrs, pixelRatio });
		}

		const base64String = stageClone.toDataURL({ ...cropAttrs, pixelRatio, mimeType: `image/${mimeType}` });

		stageClone.destroy();

		if (type === "string") {
			return base64String;
		} else if (type === "blob") {
			return base64ToBlob(base64String);
		}
	}
}
