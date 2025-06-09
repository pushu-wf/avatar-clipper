import { Draw } from "..";
import { Shape } from "konva/lib/Shape";
import { Context } from "konva/lib/Context";
import { LayerManager } from "./LayerManager";
import { LayerRenderer } from "./LayerRenderer";
import { EventResponder } from "../Handlers";

/**
 * 图层控制器 - 组合多个职责单一的模块实现完整功能
 */
export class LayerController {
	private layerManager: LayerManager;
	private layerRenderer: LayerRenderer;
	private eventResponder: EventResponder;

	constructor(private draw: Draw) {
		this.eventResponder = this.draw.getEventResponder();

		const stage = this.draw.getStage();

		// 初始化各模块
		this.layerManager = new LayerManager(stage);
		this.layerRenderer = new LayerRenderer();

		// 定义裁剪框蒙版绘制函数
		const cropmaskSceneFunc = (ctx: Context, shape: Shape) => {
			this.layerRenderer.renderCropmask(ctx, shape, stage);
		};

		// 初始化主图层
		this.layerManager.initMainLayer();

		// 渲染裁剪框
		this.layerRenderer.renderCrop(stage, this.eventResponder);

		// 初始化水印图层
		this.layerManager.initWatermarkLayer();

		// 渲染水印
		this.layerRenderer.renderWatermark(stage);

		// 初始化裁剪框蒙版图层
		this.layerManager.initCropmaskLayer(cropmaskSceneFunc);
	}
}
