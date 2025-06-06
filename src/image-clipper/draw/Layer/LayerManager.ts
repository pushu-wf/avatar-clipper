import { store } from "../../store";
import { Stage } from "konva/lib/Stage";
import { Shape } from "konva/lib/Shape";
import { Layer } from "konva/lib/Layer";
import { Context } from "konva/lib/Context";
import { Rect } from "konva/lib/shapes/Rect";

/**
 * 图层管理器 仅做图层相关属性控制，不参与实际的 rect sceneFunc 等逻辑
 */
export class LayerManager {
	private mainLayer: Layer | null = null;
	private cropmaskLayer: Layer | null = null;
	private watermarkLayer: Layer | null = null;

	constructor(private stage: Stage) {}

	/** 初始化主图层 */
	initMainLayer() {
		this.mainLayer = new Layer({ id: "mainLayer", name: "mainLayer" });
		this.stage.add(this.mainLayer);
	}

	/** 初始化水印图层 */
	initWatermarkLayer() {
		const rotation = store.getState("watermark")?.rotate ?? -45;
		this.watermarkLayer = new Layer({ id: "watermark", name: "watermark", listening: false, rotation });

		// 需要偏移才能居中旋转
		const { width, height } = this.stage.size();
		this.watermarkLayer.offsetX(width);
		this.watermarkLayer.offsetY(height);

		this.stage.add(this.watermarkLayer);
	}

	/** 初始化裁剪框蒙版层 */
	initCropmaskLayer(sceneFunc: (ctx: Context, shape: Shape) => void) {
		this.cropmaskLayer = new Layer({ id: "cropmask", name: "cropmask", listening: false });
		const rect = new Rect({
			id: "cropmaskRect",
			name: "cropmaskRect",
			sceneFunc: sceneFunc.bind(this),
		});
		this.stage.add(this.cropmaskLayer.add(rect));
	}

	// 获取水印图层
	getWatermarkLayer(): Layer {
		if (!this.watermarkLayer) throw new Error("Background layer not initialized");
		return this.watermarkLayer;
	}

	// 获取主图层
	getMainLayer(): Layer {
		if (!this.mainLayer) throw new Error("Main layer not initialized");
		return this.mainLayer;
	}

	// 获取蒙版图层
	getCropmaskLayer(): Layer {
		if (!this.cropmaskLayer) throw new Error("Toolbar layer not initialized");
		return this.cropmaskLayer;
	}
}
