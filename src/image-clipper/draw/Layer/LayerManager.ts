import { Draw } from "..";
import { store } from "../../store";
import { Stage } from "konva/lib/Stage";
import { Rect } from "konva/lib/shapes/Rect";
import { EventResponder } from "../EventResponder";
import { Layer, LayerConfig } from "konva/lib/Layer";
import { Transformer } from "konva/lib/shapes/Transformer";
import { cropUpdate } from "../../event/handlers/crop-update";
import { limitShapeController } from "../../event/handlers/crop-bound-box";
import { drawCropmaskSceneFunc, generateWatermark } from "../../utils/konva";

/**
 * @description 图层管理器
 *  1. mainLayer: 放置 背景矩形 + 图片
 *  2. watermarkLayer: 放置水印
 *  3. cropLayer: 放置裁剪框 + 裁剪框蒙版
 */
export class LayerManager {
	private stage: Stage;
	private eventResponder: EventResponder;
	constructor(private draw: Draw) {
		this.stage = this.draw.getStage();
		this.eventResponder = this.draw.getEventResponder();
		this.initLayers();
	}

	/** 初始化所有图层 */
	private initLayers() {
		this.createGeneralLayer("mainLayer", this.createMainContent);
		this.createGeneralLayer("watermarkLayer", () => generateWatermark(this.stage), {
			listening: false,
			rotation: store.getState("watermark")?.rotate ?? -45,
		});
		this.createGeneralLayer("cropLayer", this.createCropContent.bind(this));
	}

	/** 创建通用图层 */
	private createGeneralLayer(layerId: string, createContent: Function, config: LayerConfig = {}) {
		if (!this.stage) return;

		const layer = new Layer({
			id: layerId,
			name: layerId,
			...config,
		});

		// 获取 stage 的宽高
		const { width, height } = this.stage.getSize();

		// 设置水印图层的偏移量
		if (layerId === "watermarkLayer") {
			layer.offsetX(width / 2);
			layer.offsetY(height / 2);
		}

		this.stage.add(layer);

		createContent(layer);
	}

	/** 初始化主图层 */
	private createMainContent(layer: Layer) {
		// 创建背景图层
		const backgroundColor = store.getState("backgroundColor");
		const background = new Rect({
			width: layer.width(),
			height: layer.height(),
			fill: backgroundColor || "transparent",
			listening: false,
		});

		layer.add(background);
	}

	/** 初始化裁剪框图层 */
	private createCropContent(layer: Layer) {
		// 裁剪框蒙版
		const rect = new Rect({
			listening: false,
			sceneFunc: (ctx, shape) => drawCropmaskSceneFunc(ctx, shape, this.stage),
		});

		layer.add(rect);

		// 创建裁剪框
		this.renderCrop(layer);
	}

	/** 绘制裁剪框 */
	private renderCrop(layer: Layer) {
		if (!this.stage) return;

		// 获取裁剪框属性
		const cropAttr = store.getState("crop");

		// 获取 stage 的宽高
		const { width, height } = this.stage.size();

		// 创建裁剪框
		const crop = new Rect({
			id: "crop",
			x: 0,
			y: 0,
			width: cropAttr?.width ?? width * 0.5,
			height: cropAttr?.height ?? height * 0.5,
			strokeWidth: 0,
			fill: "transparent",
			stroke: "transparent",
			draggable: true,
			listening: true,
		});

		// 实现居中显示
		const x = cropAttr?.x ?? (width - crop.width()) / 2;
		const y = cropAttr?.y ?? (height - crop.height()) / 2;
		crop.position({ x, y });

		// 创建型变控制器
		const transformer = new Transformer({
			id: "crop-transformer",
			name: "crop-transformer",
			rotateEnabled: false,
			anchorStroke: cropAttr?.stroke ?? "#299CF5",
			anchorFill: cropAttr?.fill ?? "#299CF5",
			anchorSize: 8,
			anchorCornerRadius: 8,
			borderStroke: cropAttr?.stroke ?? "#299CF5",
			borderStrokeWidth: 2,
			keepRatio: cropAttr?.fixed ? true : false,
			boundBoxFunc: (oldBox, newBox) => limitShapeController(oldBox, newBox, this.stage),
		});

		// 监听事件
		crop.on("dragmove transform", cropUpdate);
		// throttle patch preview
		crop.on("dragmove transform", this.eventResponder.patchPreviewEvent.bind(this.eventResponder));

		// 添加到 crop 上
		transformer.nodes([crop]);
		layer.add(crop, transformer);
		this.stage.add(layer);
	}
}
