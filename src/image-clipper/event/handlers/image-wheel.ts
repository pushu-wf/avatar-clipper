/**
 * @description 图片缩放事件
 */

import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import { Image } from "konva/lib/shapes/Image";
import { imageScaleConfig, ShapeIDMapConfig } from "../../config";
import { KonvaEventObject } from "konva/lib/Node";

export function imageWheel(e: KonvaEventObject<WheelEvent>) {
	const stage = e.currentTarget as Stage;
	if (!stage) return;

	const mainLayer = stage.findOne(`#${ShapeIDMapConfig.mainLayerID}`) as Layer;
	if (!mainLayer) return;

	const image = mainLayer.findOne(`#${ShapeIDMapConfig.imageID}`) as Image;
	if (!image) return;

	const { deltaY } = e.evt as WheelEvent;
	// 如果小于 0 则放大 不然缩小
	// 获取当前的缩放比例
	const oldScale = image.scaleX();
	const position = stage.getPointerPosition()!;
	const mousePointTo = {
		x: position.x / oldScale - image.x() / oldScale,
		y: position.y / oldScale - image.y() / oldScale,
	};

	let newScale = deltaY < 0 ? oldScale + imageScaleConfig.scaleStep : oldScale - imageScaleConfig.scaleStep;
	// 判断阈值
	newScale = Math.min(Math.max(newScale, imageScaleConfig.minScale), imageScaleConfig.maxScale);

	image.scale({ x: newScale, y: newScale });

	const newPos = {
		x: -(mousePointTo.x - position.x / newScale) * newScale,
		y: -(mousePointTo.y - position.y / newScale) * newScale,
	};

	image.position(newPos);
}
