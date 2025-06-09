/**
 * 限制形变控制器只能在容器内
 */

import { Stage } from "konva/lib/Stage";
import { Box } from "konva/lib/shapes/Transformer";

export function limitShapeController(oldBox: Box, newBox: Box, stage: Stage) {
	// 获取 stage 的宽高
	const { width, height } = stage.getSize();

	// 如果新的 box 超出 stage 的边界，则返回旧的 box
	const { x, y, width: newBoxWidth, height: newBoxHeight } = newBox;

	if (x < 0) {
		return oldBox;
	}

	if (y < 0) {
		return oldBox;
	}

	if (x + newBoxWidth > width) {
		return oldBox;
	}
	if (y + newBoxHeight > height) {
		return oldBox;
	}

	return newBox;
}
