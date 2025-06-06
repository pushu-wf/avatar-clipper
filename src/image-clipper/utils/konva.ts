import Konva from "konva";
import { store } from "../store";
import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";
import { Shape } from "konva/lib/Shape";
import { cropInfo } from "../interface";
import { Context } from "konva/lib/Context";
import { Text } from "konva/lib/shapes/Text";
import { Rect } from "konva/lib/shapes/Rect";
import { Node } from "konva/lib/Node";

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
	const mainLayer = stage.findOne("#mainLayer") as Layer;
	if (!mainLayer) return;

	const cropRect = mainLayer.findOne("#crop") as Rect;
	if (!cropRect) return;

	// 获取实际宽高
	const cropRectInfo = cropRect.getClientRect();
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
 * @description 生成水印
 * @param { Stage } stage
 */
function generateWatermark(stage: Stage) {
	if (!stage) return;

	const watermarkLayer = <Layer>stage.findOne("#watermark");
	if (!watermarkLayer) return;

	// 每次生成水印之前，先清空
	watermarkLayer.removeChildren();

	// 如果不想显示水印，则直接返回
	// text | fontSize | density | rotate
	const wortermarkAttr = store.getState("watermark");
	if (wortermarkAttr?.text === "" || !wortermarkAttr?.text) return;

	const { width, height } = stage.getSize();

	// 创建水印 - 循环创建，并将 layer 进行旋转即可
	const simpleText = new Text({
		text: wortermarkAttr?.text ?? "Simple Text",
		fontSize: wortermarkAttr?.fontSize ?? 20,
		fontFamily: "Calibri",
		fill: wortermarkAttr?.color ?? "rgba(0,0,0,.35)",
	});

	// 定义间隔
	const [gapX, gapY] = wortermarkAttr?.gap ?? [10, 10];

	// 循环创建水印
	for (let i = -width * 2; i < width * 4; i += simpleText.width() + gapX) {
		for (let j = -height * 2; j < height * 4; j += simpleText.height() + gapY) {
			// 判断当前是否为偶数行
			const row = Math.floor(j / (simpleText.height() + gapY));
			const isEvenRow = row % 2 === 0;
			const text = simpleText.clone();
			text.x(i + (isEvenRow ? simpleText.width() / 2 : 0));
			text.y(j);
			watermarkLayer.add(text);
		}
	}
}

/**
 * @description 获取裁剪框位置信息
 * @param {Stage} stage
 */
function getCropInfo(stage: Stage) {
	if (!stage) return;

	const mainLayer = stage.findOne("#mainLayer") as Layer;
	if (!mainLayer) return;

	const crop = mainLayer.findOne("#crop") as Rect;
	if (!crop) return;

	return crop.getClientRect();
}

/**
 * @description 判断传入的两个位置信息是否一致
 * @param { x:number,y:number,width:number,height:number } pos1
 * @param { x:number,y:number,width:number,height:number } pos2
 */
function isSamePosition(pos1: cropInfo, pos2: cropInfo) {
	return pos1.x === pos2.x && pos1.y === pos2.y && pos1.width === pos2.width && pos1.height === pos2.height;
}

/**
 * @description 辅助函数 - 重新计算旋转后的位置坐标
 * @param param0
 * @param rad
 * @returns
 */
const rotatePoint = (payload: { x: number; y: number }, rad: number) => {
	const { x, y } = payload;
	const rcos = Math.cos(rad);
	const rsin = Math.sin(rad);
	return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };
};

/**
 * @description 使得节点按中心旋转
 * @param node
 * @param rotation
 */
function rotateAroundCenter(node: Node, rotation: number) {
	//current rotation origin (0, 0) relative to desired origin - center (node.width()/2, node.height()/2)
	const topLeft = { x: -node.width() / 2, y: -node.height() / 2 };
	const current = rotatePoint(topLeft, Konva.getAngle(node.rotation()));
	const rotated = rotatePoint(topLeft, Konva.getAngle(rotation));
	const dx = rotated.x - current.x,
		dy = rotated.y - current.y;

	node.rotation(rotation);

	// // 受 scale 影响
	node.position({
		x: node.x() + dx,
		y: node.y() + dy,
	});

	console.log(`Rotating to ${rotation}°, Position updated: (${node.x()}, ${node.y()})`);
}

export { drawCropmaskSceneFunc, generateWatermark, getCropInfo, isSamePosition, rotateAroundCenter };
