import Konva from "konva";
import ImageClipper from "..";
import { store } from "../store";
import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";
import { LayerController } from "./Layer";
import { rotateAroundCenter } from "../utils/konva";
import { parseContainer, parseImageSource } from "../utils";
import { Image as KonvaImage } from "konva/lib/shapes/Image";

/**
 * @description 绘制类 - 实现图层控制，绘制结果导出等
 */
export class Draw {
	private stage: Stage;
	private layerController: LayerController;

	constructor(private imageClipper: ImageClipper) {
		Reflect.set(window, "draw", this);

		// 获取 konva 挂载节点
		const root = parseContainer(store.getState("container"));
		const container = root.querySelector("#image-clipper-konva-container");

		if (!container) {
			throw new Error("container is not exist");
		}

		// 确保 container 是 HTMLDivElement 类型
		if (!(container instanceof HTMLDivElement)) {
			throw new Error("container is not a HTMLDivElement");
		}

		// konva stage 的宽高与容器一致
		const { width, height } = container.getBoundingClientRect();

		// 创建 stage
		this.stage = new Konva.Stage({ container, width, height });

		// 创建图层控制器
		this.layerController = new LayerController(this);

		// 如果传递了 image.src 则直接初始化图片
		const image = store.getState("image");
		if (image?.src) this.addImage(image.src);
	}

	/**
	 * @description 渲染容器
	 */
	public render() {
		if (!this.stage) return;
		this.stage.batchDraw();
	}

	public destroy() {
		if (!this.stage) return;
		this.stage.destroy();
	}

	/**
	 * @description 添加图片
	 * @param { string | Blob } image 图片实例
	 */
	public async addImage(image: string | Blob) {
		if (!this.stage) return;

		const mainLayer = <Layer>this.stage.findOne("#mainLayer");
		if (!mainLayer) return;

		const imageClipper = this.getImageClipper();

		// 判断当前layer 下是否已经存在图片资源
		const oldImage = mainLayer.findOne("#image");
		if (oldImage) oldImage.destroy();

		// 创建新的图片实例
		const imageNode = new Image();

		// 解析 source 资源
		const source = await parseImageSource(image);
		imageNode.src = source;

		// 基于 load 事件实现 konva image 创建
		imageNode.onload = () => {
			// 创建 Konva.Image
			const konvaImage = new KonvaImage({
				id: "image",
				image: imageNode,
				draggable: store.getState("image")?.draggable,
				listening: true,
			});
			konvaImage.setAttrs({ originWidth: imageNode.width, originHeight: imageNode.height });

			mainLayer.add(konvaImage);
			// 一定要设置 zIndex，不然裁剪框无法在上层
			konvaImage.zIndex(0);

			this.handleImageAdaptive();

			this.render();

			// patch image loaded event
			imageClipper.event.dispatchEvent("imageLoaded");
		};

		// patch image error event
		imageNode.onerror = () => imageClipper.event.dispatchEvent("imageError");
	}

	/**
	 * @description updateImage 处理图片的自适应方式 | 位置 | 宽高(更新图片属性)
	 */
	public handleImageAdaptive() {
		const imageInfo = store.getState("image");
		if (!imageInfo) return;

		// 获取主图层和图像节点
		const mainLayer = this.stage?.findOne("#mainLayer") as Layer;
		const konvaImage = mainLayer?.findOne("#image") as KonvaImage;

		if (!konvaImage) {
			console.error("ImageClipper: 未找到图片节点，请检查是否传递了 src 属性");
			return;
		}

		// 设置 objectFit 模式
		this.applyObjectFit(konvaImage, imageInfo.objectFit);

		// 设置旋转（绕中心旋转）
		rotateAroundCenter(konvaImage, imageInfo.rotation ?? 0);
	}

	/**
	 * 根据 objectFit 类型应用不同的缩放策略
	 * @param konvaImage
	 * @param imageInfo
	 */
	private applyObjectFit(konvaImage: Konva.Image, objectFit: "contain" | "cover" | "fill" = "contain") {
		if (!objectFit) return;

		const stageSize = this.stage?.getSize();
		if (!stageSize) return;

		const { width: containerWidth, height: containerHeight } = stageSize;
		const { originWidth, originHeight } = konvaImage.getAttrs();

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
	}

	// getter
	public getStage = () => this.stage;
	public getImageClipper = () => this.imageClipper;
	public getLayerController = () => this.layerController;
}
