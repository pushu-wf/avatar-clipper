import { md5 } from "../utils";
import { Draw } from "../draw";
import { Layer } from "konva/lib/Layer";
import { historyConfig } from "../config/index";

export class HistoryManager {
	private draw: Draw;
	private undoStack: Layer[] = []; // undo 栈
	private redoStack: Layer[] = []; // redo 栈

	constructor(draw: Draw) {
		this.draw = draw;

		// 初始化默认图层
		const stage = this.draw.getStage();
		const layer = this.draw.getLayer();

		if (!stage || !layer) return;

		this.undoStack.push(layer.clone());
	}

	// 撤销动作
	public undo() {
		// 需要保留背景图层，因此 撤销栈不能为0
		if (this.undoStack.length <= 1) return console.log("不可撤销");
		// 获取当前图层，放到 redoStack，并删除 undoStack
		const layer = this.undoStack.pop()!;
		this.redoStack.push(layer);
		// 重新渲染图层
		this.render();
	}

	// 重做动作
	public redo() {
		if (this.redoStack.length <= 0) return console.log("不可重做");
		// 获取当前图层，放到 undoStack，并删除 redoStack
		const layer = this.redoStack.pop()!.clone();
		this.undoStack.push(layer.clone());
		// 重新渲染图层
		this.render();
	}

	/** 添加记录 */
	public patchHistory() {
		console.log("✅ patchHistory");

		const stage = this.draw.getStage();
		if (!stage) return;

		const mainLayer = <Layer>stage.findOne("#mainLayer");
		if (!mainLayer) return;

		// 当前图层的JSON串 - 不直接使用 toJSON()，避免影响原图层
		const layerClone = mainLayer.clone();
		// 不然添加新的记录记录，直接添加到 undoStack
		layerClone.find("#transformer").forEach((t) => t.destroy());

		const layerJson = JSON.stringify(layerClone.toObject());
		// 当前图层的 MD5
		const layerMD5 = md5(layerJson);

		// 被添加图层与最后缓存的记录是否一致
		const lastLayer = this.undoStack[this.undoStack.length - 1];
		const lastLayerJson = JSON.stringify(lastLayer?.toObject());
		const lastLayerMD5 = md5(lastLayerJson);

		// 如果最后一个记录与当前记录一致，则不添加记录
		if (layerMD5 === lastLayerMD5) return console.log("历史记录一致");

		this.undoStack.push(layerClone);

		// 如果记录数大于 HISTORY_MAX_RECORED，则删除最前的记录
		while (this.undoStack.length > historyConfig.maxHistoryCount) this.undoStack.shift();
	}

	// 清空历史记录
	public clearHistory() {
		this.undoStack = [];
		this.redoStack = [];
	}

	/** 重新渲染图层 */
	private render() {
		// 取出上一次的图层，并添加到当前图层
		const lastLayer = this.undoStack[this.undoStack.length - 1];
		const layerClone = lastLayer.clone(); // 这里一定要 clone 避免图层引用导致的历史记录异常问题

		// 进行图层更新 - 克隆当前 children 即可
		const stage = this.draw.getStage();
		if (!stage) return;

		const mainLayer = <Layer>stage.findOne("#mainLayer");
		if (!mainLayer) return;

		// 增量更方案：
		const currentShapes = mainLayer.getChildren().map((i) => i); // 当前图层所有 shapes
		const targetShapes = layerClone.getChildren().map((i) => i); // 要恢复的图层所有 shapes

		// 第一步：检查当前图层中是否存在需要删除或更新的 shape
		currentShapes.forEach((shape) => {
			const id = shape.id();

			if (!id) return; // 忽略无 id 的 shape

			const targetShape = targetShapes.find((s) => s.id() === id);

			if (!targetShape) {
				// 当前 shape 在目标图层不存在，需要删除
				shape.destroy();
			} else {
				// 比较 MD5 判断是否一致
				const currentMD5 = md5(JSON.stringify(shape.toObject()));
				const targetMD5 = md5(JSON.stringify(targetShape.toObject()));

				if (currentMD5 !== targetMD5) {
					// 不一致则替换 shape
					shape.destroy();
					mainLayer.add(targetShape.clone());
				}
			}
		});

		// 第二步：检查是否有新增的 shape（存在于目标但不在当前图层）
		targetShapes.forEach((shape) => {
			const id = shape.id();
			if (!id) return;

			const currentShape = currentShapes.find((s) => s.id() === id);
			if (!currentShape) {
				mainLayer.add(shape.clone()); // 添加新 shape
			}
		});

		// 重新更新视图
		this.draw.render({ patchHistory: false });
	}
}
