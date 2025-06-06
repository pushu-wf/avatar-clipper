import { Stage } from "konva/lib/Stage";
import { Shape } from "konva/lib/Shape";
import { Context } from "konva/lib/Context";
import { drawCropmaskSceneFunc, generateWatermark } from "../../utils/konva";
import { Transformer } from "konva/lib/shapes/Transformer";
import { store } from "../../store";
import { Rect } from "konva/lib/shapes/Rect";
import { Layer } from "konva/lib/Layer";
import { cropUpdate } from "../../event/handlers/crop-update";

export class LayerRenderer {
	/**
	 * 绘制水印
	 */
	renderWatermark(stage: Stage) {
		// 生成水印，需要参数控制是否渲染
		generateWatermark(stage);
	}

	/**
	 * 绘制裁剪框蒙版
	 */
	renderCropmask(ctx: Context, shape: Shape, stage: Stage) {
		drawCropmaskSceneFunc(ctx, shape, stage);
	}

	/**
	 * 绘制裁剪框
	 */
	renderCrop(stage: Stage) {
		const layer = stage.findOne("#mainLayer") as Layer;
		// 获取裁剪框属性
		const cropAttr = store.getState("crop");
		// 获取 stage 的宽高
		const { width, height } = stage.size();

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
			rotateEnabled: false,
			anchorStroke: cropAttr?.stroke ?? "#299CF5",
			anchorFill: cropAttr?.fill ?? "#299CF5",
			anchorSize: 8,
			anchorCornerRadius: 8,
			borderStroke: cropAttr?.stroke ?? "#299CF5",
			borderStrokeWidth: 2,
		});

		// 监听事件
		crop.on("dragmove transform", cropUpdate);

		// 添加到 crop 上
		transformer.nodes([crop]);
		layer.add(crop, transformer);
		stage.add(layer);
	}
}
