import { Stage } from "konva/lib/Stage";
import { store } from "../../store";
import { KonvaEventObject } from "konva/lib/Node";
import { Draw } from "../../draw";
import { EventResponder } from "../../draw/EventResponder";

// 定义右键菜单内容
const menuArray = [
	{
		key: "upload",
		svg: '<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="120" height="120"><path d="M268.8 597.333333h51.2c12.8 0 21.333333-8.533333 21.333333-21.333333s-8.533333-21.333333-21.333333-21.333333H268.8c-17.066667 0-25.6 0-34.133333 4.266666-8.533333 4.266667-12.8 8.533333-17.066667 17.066667-4.266667 8.533333-4.266667 12.8-4.266667 34.133333v102.4c0 17.066667 0 25.6 4.266667 34.133334 4.266667 8.533333 8.533333 12.8 17.066667 17.066666 8.533333 4.266667 12.8 4.266667 34.133333 4.266667h486.4c17.066667 0 25.6 0 34.133333-4.266667 8.533333-4.266667 12.8-8.533333 17.066667-17.066666 4.266667-8.533333 4.266667-12.8 4.266667-34.133334v-102.4c0-17.066667 0-25.6-4.266667-34.133333-4.266667-8.533333-8.533333-12.8-17.066667-17.066667-8.533333-4.266667-12.8-4.266667-34.133333-4.266666h-51.2c-12.8 0-21.333333 8.533333-21.333333 21.333333s8.533333 21.333333 21.333333 21.333333H768V725.333333H256V610.133333 597.333333h12.8z" p-id="1415"></path><path d="M533.333333 328.533333l85.333334 85.333334c8.533333 8.533333 21.333333 8.533333 29.866666 0 8.533333-8.533333 8.533333-21.333333 0-29.866667l-119.466666-119.466667c-8.533333-8.533333-21.333333-8.533333-29.866667 0L375.466667 384c-8.533333 8.533333-8.533333 21.333333 0 29.866667 8.533333 8.533333 21.333333 8.533333 29.866666 0l85.333334-85.333334v281.6c0 12.8 8.533333 21.333333 21.333333 21.333334s21.333333-8.533333 21.333333-21.333334V328.533333z"></path></svg>',
		text: "上传",
	},
	{
		key: "download",
		svg: '<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="120" height="120"><path d="M533.333333 558.933333l85.333334-85.333333c8.533333-8.533333 21.333333-8.533333 29.866666 0 8.533333 8.533333 8.533333 21.333333 0 29.866667l-119.466666 119.466666c-8.533333 8.533333-21.333333 8.533333-29.866667 0l-119.466667-119.466666c-8.533333-8.533333-8.533333-21.333333 0-29.866667 4.266667-4.266667 17.066667-4.266667 25.6 0l85.333334 85.333333V277.333333c0-12.8 8.533333-21.333333 21.333333-21.333333s21.333333 8.533333 21.333333 21.333333v281.6z m-264.533333 38.4H256V725.333333H768V610.133333 597.333333h-64c-12.8 0-21.333333-8.533333-21.333333-21.333333s8.533333-21.333333 21.333333-21.333333h51.2c17.066667 0 25.6 0 34.133333 4.266666 8.533333 4.266667 12.8 8.533333 17.066667 17.066667 4.266667 8.533333 4.266667 12.8 4.266667 34.133333v102.4c0 17.066667 0 25.6-4.266667 34.133334-4.266667 8.533333-8.533333 12.8-17.066667 17.066666-8.533333 4.266667-12.8 4.266667-34.133333 4.266667H268.8c-17.066667 0-25.6 0-34.133333-4.266667-8.533333-4.266667-12.8-8.533333-17.066667-17.066666-4.266667-8.533333-4.266667-12.8-4.266667-34.133334v-102.4c0-17.066667 0-25.6 4.266667-34.133333 4.266667-8.533333 8.533333-12.8 17.066667-17.066667 8.533333-4.266667 12.8-4.266667 34.133333-4.266666h51.2c12.8 0 21.333333 8.533333 21.333333 21.333333s-8.533333 21.333333-21.333333 21.333333H268.8z"></path></svg>',
		text: "下载",
	},
	{
		divider: true,
		color: "#F56C6C",
		key: "clear",
		svg: '<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="120" height="120"><path d="M384 298.666667v-8.533334c0-21.333333 4.266667-34.133333 8.533333-42.666666 4.266667-8.533333 12.8-17.066667 25.6-25.6 8.533333-4.266667 21.333333-8.533333 42.666667-8.533334h102.4c21.333333 0 34.133333 4.266667 42.666667 8.533334 8.533333 4.266667 17.066667 12.8 25.6 25.6 4.266667 8.533333 8.533333 21.333333 8.533333 42.666666V298.666667h149.333333c12.8 0 21.333333 8.533333 21.333334 21.333333s-8.533333 21.333333-21.333334 21.333333h-554.666666c-12.8 0-21.333333-8.533333-21.333334-21.333333s8.533333-21.333333 21.333334-21.333333H384z m42.666667 0h170.666666v-8.533334c0-12.8 0-17.066667-4.266666-21.333333 0-4.266667-4.266667-4.266667-8.533334-8.533333 0-4.266667-8.533333-4.266667-21.333333-4.266667h-102.4c-12.8 0-17.066667 0-21.333333 4.266667-4.266667 0-4.266667 4.266667-8.533334 8.533333-4.266667 0-4.266667 8.533333-4.266666 21.333333V298.666667zM341.333333 405.333333V682.666667c0 34.133333 0 46.933333 4.266667 55.466666 4.266667 8.533333 8.533333 12.8 12.8 17.066667 12.8 12.8 21.333333 12.8 51.2 12.8h209.066667c29.866667 0 38.4 0 46.933333-8.533333 8.533333-4.266667 12.8-8.533333 12.8-17.066667 4.266667-12.8 4.266667-21.333333 4.266667-59.733333V405.333333c0-12.8 8.533333-21.333333 21.333333-21.333333s21.333333 8.533333 21.333333 21.333333v285.866667c0 42.666667-4.266667 55.466667-12.8 72.533333-8.533333 17.066667-17.066667 25.6-34.133333 34.133334-12.8 8.533333-25.6 12.8-64 12.8H409.6c-38.4 0-51.2-4.266667-64-12.8s-25.6-21.333333-34.133333-34.133334c-8.533333-17.066667-12.8-34.133333-12.8-72.533333V405.333333c0-12.8 8.533333-21.333333 21.333333-21.333333s21.333333 8.533333 21.333333 21.333333z m106.666667 21.333334c12.8 0 21.333333 8.533333 21.333333 21.333333v213.333333c0 12.8-8.533333 21.333333-21.333333 21.333334s-21.333333-8.533333-21.333333-21.333334v-213.333333c0-12.8 8.533333-21.333333 21.333333-21.333333z m128 0c12.8 0 21.333333 8.533333 21.333333 21.333333v213.333333c0 12.8-8.533333 21.333333-21.333333 21.333334s-21.333333-8.533333-21.333333-21.333334v-213.333333c0-12.8 8.533333-21.333333 21.333333-21.333333z"></path></svg>',
		text: "清空",
	},
];

export function contextmenu(e: KonvaEventObject<MouseEvent>, draw: Draw) {
	e.cancelBubble = true;
	e.evt.preventDefault();

	const target = e.currentTarget;
	const stage = target.getStage();
	if (!stage) return;

	// 判断是否启用右键菜单
	const enableContextmenu = store.getState("enableContextmenu");
	if (!enableContextmenu) return;

	// TODO: 右键菜单配置 - 支持用户自定义右键菜单，传入 callback 通过 command 实现定制

	// 获取当前 stage 的容器
	const container = stage.container();
	if (!container) return;

	/** hide menu */
	const hideMenu = () => {
		container.querySelector(".avatar-clipper-contextmenu")?.remove();
		document.removeEventListener("click", hideMenu);
	};

	// 创建菜单之前先隐藏菜单
	hideMenu();

	// 创建右键菜单
	const menuBox = document.createElement("div");
	menuBox.className = "avatar-clipper-contextmenu";

	// Prevent context menu from showing on right click inside the menu
	menuBox.addEventListener("contextmenu", (e) => e.preventDefault());

	menuBox.innerHTML = menuArray
		.map(
			(item) =>
				`<div class="menu-item" 
					style="color:${item.color};border-top:solid ${item.divider ? "#e4e4e7" : "transparent"} 1px" 
					data-event="${item.key}">${item.svg}${item.text}</div>`
		)
		.join("");

	// 定义事件映射
	const eventResponder = draw.getEventResponder();

	// add event listener to menu items
	menuBox.addEventListener("click", (e) => {
		const target = e.target as HTMLElement;
		const event = target.dataset.event;
		switch (event) {
			case "upload":
				uploadImage(eventResponder);
				break;
			case "download":
				downloadImage(eventResponder);
				break;
			case "clear":
				eventResponder.clearImage();
				break;

			default:
				console.log("unknown event:", event);
				break;
		}
	});

	// add menu to stage container
	container.appendChild(menuBox);

	// set menu position
	updateMenuPosition(stage, menuBox);

	// Hide menu when clicking outside
	document.addEventListener("click", hideMenu);
}

/**
 * @description 纠正菜单位置
 */
function updateMenuPosition(stage: Stage, menuBox: HTMLDivElement) {
	const pointer = stage.getPointerPosition();
	if (!pointer) return;

	// 获取 menuBox 的宽高
	const { width, height } = menuBox.getBoundingClientRect();
	const x = Math.min(pointer.x, stage.getSize().width - width);
	const y = Math.min(pointer.y, stage.getSize().height - height);

	menuBox.style.left = `${x}px`;
	menuBox.style.top = `${y}px`;
}

/**
 * 上传图片实现
 */
function uploadImage(eventResponder: EventResponder) {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "image/*";
	input.onchange = function () {
		const image = input.files![0];
		if (!image) return;
		// 调用 command 方法
		eventResponder.setImage(image);
		input.value = "";
		input.remove();
	};
	input.click();
}

/**
 * 下载图片实现
 */
function downloadImage(eventResponder: EventResponder) {
	const blob = <Blob>eventResponder.getResult("blob");
	if (!blob) return;

	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = "avatar-clipper.png";
	a.click();
	URL.revokeObjectURL(a.href);
}
