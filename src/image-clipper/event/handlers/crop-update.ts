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

	// 纠正位置信息，限定在 stage 内
	if (cropInfo.x < 0) target.x(0);
	if (cropInfo.y < 0) target.y(0);
	if (cropInfo.x + cropInfo.width > width) target.x(width - cropInfo.width);
	if (cropInfo.y + cropInfo.height > height) target.y(height - cropInfo.height);

	// 判断裁剪框尺寸
	if (cropInfo.width < 20) target.width(20);
	if (cropInfo.height < 20) target.height(20);

	// 更新视图
	stage.batchDraw();
}
