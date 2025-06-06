import Konva from "konva";
import ImageClipper from "..";
import { store } from "../store";
import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";
import { LayerController } from "./Layer";
import { parseImageSource } from "../utils";
import { EventBus } from "../event/EventBus";
import { EventBusMap } from "../interface/EventBusMap";
import { Image as KonvaImage } from "konva/lib/shapes/Image";

export class Draw {
	private stage: Stage;
	layerController: LayerController;

	constructor(private imageClipper: ImageClipper, private event: EventBus<EventBusMap>) {
		Reflect.set(window, "draw", this);

		const root = this.imageClipper.getContainer();
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
				x: 0,
				y: 0,
				width: imageNode.width,
				height: imageNode.height,
				draggable: store.getState("image")?.draggable,
				listening: true,
			});

			mainLayer.add(konvaImage);

			this.render();

			// patch image loaded event
			imageClipper.dispatchEvent("imageLoaded");
		};

		// patch image error event
		imageNode.onerror = () => imageClipper.dispatchEvent("imageError");
	}

	// getter
	public getEvent = () => this.event;
	public getStage = () => this.stage;
	public getImageClipper = () => this.imageClipper;
}
