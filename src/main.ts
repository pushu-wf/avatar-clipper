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

// 获取所有的图片对象
const imageList = <NodeListOf<HTMLImageElement>>document.querySelectorAll(".preview-list img");

// 图片加载失败时，尝试加载新的图片资源
clipper.event.on("imageError", () => clipper.command.setImage("https://picsum.photos/200/300"));

// 监听 preview 事件,对预览结果进行初始化
clipper.event.on("preview", (result) => imageList.forEach((item) => (item.src = result)));

// 监听 afterInit 事件，初始化第一次图片资源
clipper.event.on("afterInit", (result) => imageList.forEach((item) => (item.src = result)));

// 监听 imageUpload 图片更新事件
clipper.event.on("imageUpdate", (attrs) => {
	imageAttrs.scaleX = attrs.scaleX!;
	imageAttrs.scaleY = attrs.scaleY!;
	imageAttrs.rotation = attrs.rotation!;
});

// 定义事件映射列表
const eventMap: { [key: string]: () => void } = {
	upload,
	clear: clipper.command.clearImage,
	reset: clipper.command.reset,
	enlarge: () => clipper.command.updateImageAttrs({ scaleX: imageAttrs.scaleX + scaleStep, scaleY: imageAttrs.scaleY + scaleStep }),
	reduce: () => clipper.command.updateImageAttrs({ scaleX: imageAttrs.scaleX - scaleStep, scaleY: imageAttrs.scaleY - scaleStep }),
	rotate: () => clipper.command.updateImageAttrs({ rotation: imageAttrs.rotation + 45 }),
};

// 上传 | 清空 | 重置 | 缩小 | 放大 | 旋转
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

// Image | Crop | Watermark tab 切换
const tabs = <NodeListOf<HTMLButtonElement>>document.querySelectorAll(".clipper-tabs button.tab-button");
// 获取 tab 对应的内容
const tabContents = <NodeListOf<HTMLDivElement>>document.querySelectorAll(".tab-content > div");
tabs.forEach((tab) => {
	tab.addEventListener("click", () => {
		const type = <string>tab.dataset.btnType;
		if (!type) return;

		// 给当前点击的 button 添加 active 类
		tabs.forEach((item) => item.classList.remove("active"));
		tab.classList.add("active");

		// 处理 container 内容显示 切换的核心： id="setting-for-image"
		tabContents.forEach((item) => {
			item.style.display = item.id === `setting-for-${type}` ? "block" : "none";
		});
	});
});

// set background color
const backgroundColorPicker = document.querySelector("input#background-color") as HTMLInputElement;
const backgroundColorInput = document.querySelector("input#background-color-input") as HTMLInputElement;
backgroundColorPicker.addEventListener("change", () => {
	backgroundColorInput.value = backgroundColorPicker.value;
	clipper.command.updateClipperOptions({ backgroundColor: backgroundColorInput.value });
});
backgroundColorInput.addEventListener("input", () => {
	backgroundColorPicker.value = backgroundColorInput.value;
	clipper.command.updateClipperOptions({ backgroundColor: backgroundColorInput.value });
});

// enable contextmenu
const enableContextmenu = document.querySelector("input#enable-contextmenu") as HTMLInputElement;
enableContextmenu.addEventListener("change", () => {
	const enable = enableContextmenu.checked;
	clipper.command.updateClipperOptions({ enableContextmenu: enable });
});

// set image draggable
const imageDraggable = document.querySelector("input#image-draggable") as HTMLInputElement;
imageDraggable.addEventListener("change", () => {
	const draggable = imageDraggable.checked;
	clipper.command.updateImageAttrs({ draggable });
});

// set image zoom
const imageZoom = document.querySelector("input#image-zoom") as HTMLInputElement;
imageZoom.addEventListener("change", () => {
	const zoom = imageZoom.checked;
	clipper.command.updateImageAttrs({ zoom });
});

// set crop anchor fill
const cropAnchorFillPicker = document.querySelector("input#crop-anchor-fill") as HTMLInputElement;
const cropAnchorFillInput = document.querySelector("input#crop-anchor-fill-input") as HTMLInputElement;
cropAnchorFillPicker.addEventListener("change", () => {
	cropAnchorFillInput.value = cropAnchorFillPicker.value;
	clipper.command.updateCropAttrs({ fill: cropAnchorFillInput.value });
});
cropAnchorFillInput.addEventListener("input", () => {
	cropAnchorFillPicker.value = cropAnchorFillInput.value;
	clipper.command.updateCropAttrs({ fill: cropAnchorFillInput.value });
});

// set crop anchor stroke
const cropAnchorStrokePicker = document.querySelector("input#crop-anchor-stroke") as HTMLInputElement;
const cropAnchorStrokeInput = document.querySelector("input#crop-anchor-stroke-input") as HTMLInputElement;
cropAnchorStrokePicker.addEventListener("change", () => {
	cropAnchorStrokeInput.value = cropAnchorStrokePicker.value;
	clipper.command.updateCropAttrs({ stroke: cropAnchorStrokeInput.value });
});
cropAnchorStrokeInput.addEventListener("input", () => {
	cropAnchorStrokePicker.value = cropAnchorStrokeInput.value;
	clipper.command.updateCropAttrs({ stroke: cropAnchorStrokeInput.value });
});

// set crop fixed ratio
const cropFixed = document.querySelector("input#crop-fixed") as HTMLInputElement;
cropFixed.addEventListener("change", () => clipper.command.updateCropAttrs({ fixed: cropFixed.checked }));

// set crop draggable
const cropDraggable = document.querySelector("input#crop-draggable") as HTMLInputElement;
cropDraggable.addEventListener("change", () => clipper.command.updateCropAttrs({ draggable: cropDraggable.checked }));

// set crop resize
const cropResize = document.querySelector("input#crop-resize") as HTMLInputElement;
cropResize.addEventListener("change", () => clipper.command.updateCropAttrs({ resize: cropResize.checked }));

// set watermark text
const watermarkText = document.querySelector("input#watermark-text") as HTMLInputElement;
watermarkText.addEventListener("input", () => clipper.command.updateWatermarkAttrs({ text: watermarkText.value }));

// set watermark color
const watermarkColorPicker = document.querySelector("input#watermark-color") as HTMLInputElement;
const watermarkColorInput = document.querySelector("input#watermark-color-input") as HTMLInputElement;
watermarkColorPicker.addEventListener("change", () => {
	watermarkColorInput.value = watermarkColorPicker.value;
	clipper.command.updateWatermarkAttrs({ color: watermarkColorInput.value });
});
watermarkColorInput.addEventListener("input", () => {
	watermarkColorPicker.value = watermarkColorInput.value;
	clipper.command.updateWatermarkAttrs({ color: watermarkColorInput.value });
});

// set watermark angle
const watermarkRotation = document.querySelector("input#watermark-rotation") as HTMLInputElement;
watermarkRotation.addEventListener("input", () => clipper.command.updateWatermarkAttrs({ rotation: +watermarkRotation.value }));

// set watermark font size
const watermarkFontSize = document.querySelector("input#watermark-font-size") as HTMLInputElement;
watermarkFontSize.addEventListener("input", () => clipper.command.updateWatermarkAttrs({ fontSize: +watermarkFontSize.value }));

// set watermark gap x
const watermarkGapX = document.querySelector("input#watermark-gap-x") as HTMLInputElement;
const watermarkGapY = document.querySelector("input#watermark-gap-y") as HTMLInputElement;
watermarkGapX.addEventListener("input", () => clipper.command.updateWatermarkAttrs({ gap: [+watermarkGapX.value, +watermarkGapY.value] }));
watermarkGapY.addEventListener("input", () => clipper.command.updateWatermarkAttrs({ gap: [+watermarkGapX.value, +watermarkGapY.value] }));
