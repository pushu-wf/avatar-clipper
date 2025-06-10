/**
 * @description 图片缩放事件
 */

import { store } from "../../store";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import { Image } from "konva/lib/shapes/Image";
import { KonvaEventObject } from "konva/lib/Node";
import { imageScaleConfig, shapeIDMapConfig } from "../../config";

/**
 * 图片缩放平移实现
 * @param e
 * @returns
 */
export function imageWheel(e: KonvaEventObject<WheelEvent>) {
	const stage = e.currentTarget as Stage;
	if (!stage) return;

	e.cancelBubble = true;
	e.evt.preventDefault();

	const mainLayer = stage.findOne(`#${shapeIDMapConfig.mainLayerID}`) as Layer;
	if (!mainLayer) return;

	const image = mainLayer.findOne(`#${shapeIDMapConfig.imageID}`) as Image;
	if (!image) return;

	const { deltaY, shiftKey, ctrlKey } = e.evt as WheelEvent;

	// 处理滚轮事件
	if (ctrlKey) {
		handleZoom(stage, image, deltaY);
	} else {
		handlePan(image, deltaY, shiftKey);
	}

	// 图片更新完成后，需要同步图片属性到 store 中
	const imageAttrs = {
		...store.getState("image"),
		x: image.x(),
		y: image.y(),
		width: image.width(),
		height: image.height(),
		scaleX: image.scaleX(),
		scaleY: image.scaleY(),
		rotation: image.rotation(),
	};

	store.setState("image", imageAttrs);
}

function handleZoom(stage: Stage, image: Image, deltaY: number) {
	// 获取参数 - 是否支持缩放
	const { zoom } = store.getState("image")!;
	if (!zoom) return;

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

function handlePan(image: Image, deltaY: number, shiftKey: boolean) {
	// 获取参数 - 是否支持平移
	const { draggable } = store.getState("image")!;
	if (!draggable) return;

	// 获取当前的 position
	const { x, y } = image.position();
	let newX = x;
	let newY = y;

	// 需要实现平移、缩放等功能
	// 将 deltaY 值转化为 boolean 值
	const isDown = deltaY > 0;
	// 那么，当前的场景就分为 true_true true_false false_true false_false 四种情况
	const direction = isDown ? (shiftKey ? "right" : "down") : shiftKey ? "left" : "up";

	if (direction === "down") newY = y - imageScaleConfig.translateStep;
	if (direction === "up") newY = y + imageScaleConfig.translateStep;
	if (direction === "left") newX = x + imageScaleConfig.translateStep;
	if (direction === "right") newX = x - imageScaleConfig.translateStep;

	image.position({ x: newX, y: newY });
}
