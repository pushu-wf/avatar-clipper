import { Draw } from "..";
import { store } from "../../store";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import { Rect } from "konva/lib/shapes/Rect";
import { ShapeIDMapConfig } from "../../config";
import { EventResponder } from "../EventResponder";
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
		this.createGeneralLayer(ShapeIDMapConfig.mainLayerID, this.createMainContent);
		this.createGeneralLayer(ShapeIDMapConfig.watermarkLayerID, () => generateWatermark(this.stage));
		this.createGeneralLayer(ShapeIDMapConfig.cropLayerID, this.createCropContent.bind(this));
	}

	/** 创建通用图层 */
	private createGeneralLayer(layerId: string, createContent: Function) {
		if (!this.stage) return;

		// 创建指定 ID 的图层
		const layer = new Layer({ id: layerId, name: layerId });

		// 获取 stage 的宽高
		const { width, height } = this.stage.getSize();

		// 设置水印图层的偏移量
		if (layerId === "watermarkLayer") {
			// 获取用户传递的水印图层旋转角度
			const rotation = store.getState("watermark")?.rotate ?? -45;
			layer.rotation(rotation);
			layer.listening(false);
			layer.offsetX(width / 2);
			layer.offsetY(height / 2);
		}

		this.stage.add(layer);

		createContent(layer);
	}

	/** 初始化主图层 */
	private createMainContent(layer: Layer) {
		// 获取用户传递的背景颜色
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

		// 获取 stage 的宽高
		const { width, height } = this.stage.size();

		// 创建裁剪框
		const crop = this.createCropRect(width, height);

		// 创建形变控制器
		const transformer = this.createCropTransformer();

		transformer.nodes([crop]);

		// 添加到图层
		layer.add(crop, transformer);
		this.stage.add(layer);
	}

	/** 创建裁剪框 */
	private createCropRect(width: number, height: number): Rect {
		// 获取裁剪框属性
		const cropAttr = store.getState("crop");

		// 创建裁剪框
		const crop = new Rect({
			id: ShapeIDMapConfig.cropRectID,
			width: cropAttr?.width ?? width * 0.5,
			height: cropAttr?.height ?? height * 0.5,
			draggable: true,
		});

		// 实现居中显示
		const x = cropAttr?.x ?? (width - crop.width()) / 2;
		const y = cropAttr?.y ?? (height - crop.height()) / 2;
		crop.position({ x, y });

		// 监听事件
		crop.on("dragmove transform", cropUpdate);

		// throttle patch preview
		crop.on("dragmove transform", this.eventResponder.patchPreviewEvent.bind(this.eventResponder));

		return crop;
	}

	/** 创建形变控制器 */
	private createCropTransformer(): Transformer {
		// 获取裁剪框属性
		const cropAttr = store.getState("crop");

		// 创建型变控制器
		return new Transformer({
			id: ShapeIDMapConfig.cropTransformerID,
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
	}
}
