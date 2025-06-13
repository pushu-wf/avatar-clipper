import { store } from "../../store";
import { KonvaEventObject } from "konva/lib/Node";

export function contextmenu(e: KonvaEventObject<MouseEvent>) {
	e.cancelBubble = true;
	e.evt.preventDefault();

	// 判断是否启用右键菜单
	const enableContextmenu = store.getState("enableContextmenu");
	if (!enableContextmenu) return;

	// TODO: 右键菜单配置 - 支持用户自定义右键菜单，传入 callback 通过 command 实现定制
}
