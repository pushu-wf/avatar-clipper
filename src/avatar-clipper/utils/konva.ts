import Konva from "konva";
import { store } from "../store";
import { mergeOptions } from ".";
import { Node } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";
import { Shape } from "konva/lib/Shape";
import { Context } from "konva/lib/Context";
import { Rect } from "konva/lib/shapes/Rect";
import { Transformer } from "konva/lib/shapes/Transformer";
import { imageScaleConfig, shapeIDMapConfig } from "../config";

/**
 * @description 计算文本宽度
 */
function getTextWidth(ctx: CanvasRenderingContext2D, text: string) {
	return ctx.measureText(text).width;
}

/**
 * @description 计算文本高度
 */
function getTextHeight(ctx: CanvasRenderingContext2D, text: string) {
	const metrics = ctx.measureText(text);
	return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
}

/**
 * @description 绘制遮罩层
 */
function drawCropmaskSceneFunc(ctx: Context, shape: Shape, stage: Stage) {
	if (!stage) return;

	const { width, height } = stage.getSize();

	// 获取裁剪框的属性
	const mainLayer = stage.findOne(`#${shapeIDMapConfig.cropLayerID}`) as Layer;
	if (!mainLayer) return;

	// 获取实际宽高
	const cropRectInfo = getCropInfo(stage);
	if (!cropRectInfo) return;
	const { x, y } = cropRectInfo;

	/*绘画顺时针外部正方形*/
	ctx.save();
	ctx.moveTo(0, 0); // 起点
	ctx.lineTo(width, 0); // 第一条线
	ctx.lineTo(width, height); // 第二条线
	ctx.lineTo(0, height); // 第三条线
	ctx.closePath(); // 结束路径，自动闭合

	/*填充颜色*/
	ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
	ctx.fill();

	ctx.restore();

	// 清空 crop 区域
	ctx.clearRect(x, y, cropRectInfo.width, cropRectInfo.height);

	// 在左上角位置 绘制宽高信息
	const text = `${Math.floor(cropRectInfo.width)} x ${Math.floor(cropRectInfo.height)}`;

	ctx.save();
	ctx.font = "12px Arial";
	const textWidth = getTextWidth(ctx._context, text);
	const textHeight = getTextHeight(ctx._context, text);
	ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	ctx.fillRect(x, y - textHeight - 20, textWidth + 10, textHeight + 10);
	ctx.fillStyle = "white";
	ctx.fillText(text, x + 5, y - 20 + textHeight / 2);
	ctx.restore();

	ctx.fillStrokeShape(shape);
}

/**
 * @description 绘制水印
 */
function drawWatermarkSceneFunc(ctx: Context, shape: Shape, stage: Stage) {
	if (!stage) return;

	const watermarkLayer = <Layer>stage.findOne(`#${shapeIDMapConfig.watermarkLayerID}`);
	if (!watermarkLayer) return;

	// 如果不想显示水印，则直接返回
	// text | fontSize | density | rotate
	const watermarkAttrs = store.getState("watermark");
	if (isEmpty(watermarkAttrs?.text)) return;

	const { width, height } = stage.getSize();

	// 定义基础属性
	const text = watermarkAttrs?.text ?? "Avatar Clipper";
	ctx.font = `${watermarkAttrs?.fontSize ?? 20}px Calibri`;
	ctx.fillStyle = watermarkAttrs?.color ?? "rgba(0, 0, 0, 0.35)";
	// ctx.fillText(text, 100, 100);
	const textWidth = getTextWidth(ctx._context, text);
	const textHeight = getTextHeight(ctx._context, text);

	// 定义间隔
	const [gapX, gapY] = watermarkAttrs?.gap ?? [20, 50];

	// 循环创建水印
	for (let i = -width * 2; i < width * 4; i += textWidth + gapX) {
		for (let j = -height * 2; j < height * 4; j += textHeight + gapY) {
			// 判断当前是否为偶数行
			const row = Math.floor(j / (textHeight + gapY));
			const isEvenRow = row % 2 === 0;
			ctx.fillText(text, i + (isEvenRow ? textWidth / 2 : 0), j);
		}
	}

	// 获取裁剪框的属性
	ctx.fillStrokeShape(shape);
}

/**
 * @description 获取裁剪框位置信息
 * @param {Stage} stage
 */
function getCropInfo(stage: Stage) {
	if (!stage) return;

	const cropLayer = stage.findOne(`#${shapeIDMapConfig.cropLayerID}`) as Layer;
	if (!cropLayer) return;

	const crop = cropLayer.findOne(`#${shapeIDMapConfig.cropRectID}`) as Rect;
	if (!crop) return;

	return crop.getClientRect();
}

/**
 * @description 辅助函数 - 重新计算旋转后的位置坐标
 * @param param0
 * @param rad
 * @returns
 */
function rotatePoint(payload: { x: number; y: number }, rad: number) {
	const { x, y } = payload;
	const rcos = Math.cos(rad);
	const rsin = Math.sin(rad);
	return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };
}

/**
 * @description 节点按中心旋转
 * @param node
 * @param rotation
 */
function rotateAroundCenter(node: Node, rotation: number) {
	rotation = rotation % 360;
	// 获取当前节点的缩放比例
	const scaleX = node.scaleX();
	const scaleY = node.scaleY();

	// 考虑缩放后的中心点坐标
	const topLeft = { x: (-node.width() / 2) * scaleX, y: (-node.height() / 2) * scaleY };
	const current = rotatePoint(topLeft, Konva.getAngle(node.rotation()));
	const rotated = rotatePoint(topLeft, Konva.getAngle(rotation));
	const dx = rotated.x - current.x;
	const dy = rotated.y - current.y;

	node.rotation(rotation);
	node.x(node.x() + dx);
	node.y(node.y() + dy);
}

/**
 * @description 节点按中心缩放
 * @param node 节点
 * @param scale 缩放比例
 */
function scaleAroundCenter(node: Node, scaleX: number, scaleY: number) {
	const imageAttrs = store.getState("image") || {};
	if (!imageAttrs.zoom) return;

	const oldScaleX = node.scaleX();
	const oldScaleY = node.scaleY();

	// 如果小于最小值
	if (scaleX < imageScaleConfig.minScale || scaleY < imageScaleConfig.minScale) {
		store.setState("image", mergeOptions(imageAttrs, { scaleX: oldScaleX, scaleY: oldScaleY }));
		return;
	}

	// 如果大于最大值
	if (scaleX > imageScaleConfig.maxScale || scaleY > imageScaleConfig.maxScale) {
		store.setState("image", mergeOptions(imageAttrs, { scaleX: oldScaleX, scaleY: oldScaleY }));
		return;
	}

	// 获取图像当前位置
	const x = node.x();
	const y = node.y();

	// 获取图像尺寸
	const width = node.width();
	const height = node.height();

	// 计算中心点坐标
	const centerX = x + (width * oldScaleX) / 2;
	const centerY = y + (height * oldScaleY) / 2;

	// 设置新缩放值
	if (!isEmpty(scaleX)) node.scaleX(scaleX);
	if (!isEmpty(scaleY)) node.scaleY(scaleY);

	// 调整位置使中心点保持不变
	node.x(centerX - (width * node.scaleX()) / 2);
	node.y(centerY - (height * node.scaleY()) / 2);
}

/**
 * @description 处理裁剪框的位置关系
 * @param stage Stage
 * @param node 节点
 * @param x x轴坐标
 * @param y y轴坐标
 * @param width 宽度
 * @param height 高度
 */
function handleCropPosition(node: Shape, x?: number, y?: number, width?: number, height?: number) {
	if (!node) return;

	// 如果四个属性都不存在，则不处理
	if (isEmpty(x) && isEmpty(y) && isEmpty(width) && isEmpty(height)) return;

	if (!isEmpty(x)) node.x(x);
	if (!isEmpty(y)) node.y(y);
	if (!isEmpty(width)) node.width(width);
	if (!isEmpty(height)) node.height(height);

	// 触发 dragmove 事件，做裁剪框位置关系处理
	node.fire("dragmove");
}

/**
 * @description 更新裁剪框形变控制器的属性
 * @param transformer Transformer
 */
function updateCropTransformerAttrs(transformer: Transformer) {
	if (!transformer) return;

	const { resize = true, fixed = false, fill, stroke } = store.getState("crop") || {};

	if (!isEmpty(resize)) {
		transformer.resizeEnabled(resize);
	}

	transformer.keepRatio(fixed);
	// 如果固定缩放比例，则上下左右的控制点不可控制
	if (fixed) {
		transformer.enabledAnchors(["top-left", "top-right", "bottom-left", "bottom-right"]);
	} else {
		transformer.enabledAnchors(null);
	}
	if (!isEmpty(fill)) {
		transformer.anchorFill(fill);
	}

	if (!isEmpty(stroke)) {
		transformer.anchorStroke(stroke);
		transformer.borderStroke(stroke);
	}
}

/**
 * @description 辅助函数 - base64 转 Blob
 * @param { string } base64 base64 string
 * @returns Blob
 */
function base64ToBlob(base64: string) {
	if (!base64) return;
	const arr = base64.split(",");
	if (!arr || !arr.length) return;
	const mime = arr[0].match(/:(.*?);/)?.[1];
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}

/**
 * @description 判断传入的属性是否为空
 */
function isEmpty(payload: unknown) {
	if (payload instanceof Array && payload.length === 0) return true;
	else if (payload instanceof Object && Object.keys(payload).length === 0) return true;
	else if (payload === null || payload === undefined || payload === "") return true;
	else return false;
}

export {
	isEmpty,
	getCropInfo,
	base64ToBlob,
	scaleAroundCenter,
	rotateAroundCenter,
	handleCropPosition,
	drawCropmaskSceneFunc,
	drawWatermarkSceneFunc,
	updateCropTransformerAttrs,
};
