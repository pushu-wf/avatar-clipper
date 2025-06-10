import { Rect } from "konva/lib/shapes/Rect";
import { getCropInfo } from "../../utils/konva";
import { KonvaEventObject } from "konva/lib/Node";

/**
 * 剪裁框位置更新
 */
export function cropUpdate(e: KonvaEventObject<MouseEvent>) {
	const target = e.currentTarget as Rect;
	if (!target) return;

	const stage = target.getStage();
	if (!stage) return;

	// 判断边界
	const { width, height } = stage.getSize();

	// 获取裁剪框位置信息
	const cropInfo = getCropInfo(stage);
	if (!cropInfo) return;
	const { width: cropWidth, height: cropHeight } = cropInfo;

	// 纠正位置信息，限定在 stage 内
	const newX = Math.max(0, Math.min(width - cropWidth, target.x()));
	const newY = Math.max(0, Math.min(height - cropHeight, target.y()));

	// 如果位置有变化才更新
	if (newX !== target.x()) target.x(newX);
	if (newY !== target.y()) target.y(newY);

	// 判断裁剪框尺寸
	const newWidth = Math.min(cropWidth, width - newX);
	const newHeight = Math.min(cropHeight, height - newY);

	// 如果尺寸有变化才更新
	if (newWidth !== cropWidth) target.width(newWidth);
	if (newHeight !== cropHeight) target.height(newHeight);

	// 更新视图
	stage.batchDraw();
}
