import { AvatarClipper } from "./avatar-clipper";

// 初始化 AvatarClipper
const clipper = new AvatarClipper({ container: "#avatar-clipper-container", image: { src: "https://picsum.photos/200/300" } });

Reflect.set(window, "clipper", clipper);
/**
 * 定义图片的基础属性,用于后期变换使用
 */
const imageAttrs = { scaleX: 1, scaleY: 1, rotation: 0 };
// 定义缩小放大步频
const scaleStep = 0.2;

// 监听  imageLoaded 事件,初始化图片参数
clipper.event.on("imageLoaded", (attrs) => {
	imageAttrs.scaleX = attrs.scaleX!;
	imageAttrs.scaleY = attrs.scaleY!;
	imageAttrs.rotation = attrs.rotation!;
});

// 获取所有的图片对象
const imageList = <NodeListOf<HTMLImageElement>>document.querySelectorAll(".preview-list img");

// 监听 preview 事件,对预览结果进行初始化
clipper.event.on("preview", (result) => {
	imageList.forEach((item) => (item.src = result));
});

// 监听 imageError 事件
clipper.event.on("imageError", (error) => {
	console.log("imageError", error);
});

// 监听 afterInit 事件，初始化第一次图片资源
clipper.event.on("afterInit", (result) => {
	imageList.forEach((item) => (item.src = result));
});

// 图片更新事件
clipper.event.on("imageUpdate", (attrs) => {
	console.log(attrs);
	imageAttrs.scaleX = attrs.scaleX!;
	imageAttrs.scaleY = attrs.scaleY!;
	imageAttrs.rotation = attrs.rotation!;
});

// 定义事件映射列表
const eventMap: { [key: string]: () => void } = { upload, clear, reset, enlarge, reduce, rotate };

// 获取按钮列表
const buttons = <NodeListOf<HTMLButtonElement>>document.querySelectorAll(".clipper-btns button");
buttons.forEach((btn) => {
	btn.addEventListener("click", () => {
		const event = <string>btn.dataset.event;
		if (event && eventMap[event]) eventMap[event]();
	});
});

/** 上传图片 **/
function upload() {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "image/*";
	input.onchange = function () {
		const image = input.files![0];
		if (!image) return;
		// 调用 command 方法
		clipper.command.setImage(image);
		input.value = "";
		input.remove();
	};
	input.click();
}

/** 清空画布 **/
function clear() {
	clipper.command.clearImage();
}

/** 重置画布 **/
function reset() {
	clipper.command.reset();
}

/** 缩小图片 **/
function reduce() {
	clipper.command.updateImageAttrs({ scaleX: imageAttrs.scaleX - scaleStep, scaleY: imageAttrs.scaleY - scaleStep });
}

/** 放大图片 **/
function enlarge() {
	clipper.command.updateImageAttrs({ scaleX: imageAttrs.scaleX + scaleStep, scaleY: imageAttrs.scaleY + scaleStep });
}

/** 旋转图片 **/
function rotate() {
	console.log(" ==> rotate");
}
