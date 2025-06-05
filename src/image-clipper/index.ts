import "./style/index.css";
import { Draw } from "./draw";
import { store } from "./store";
import { Command } from "./command/Command";
import { EventBus } from "./event/EventBus";
import { ImageClipperConfig } from "./interface";
import { EventBusMap } from "./interface/EventBusMap";
import { CommandAdapt } from "./command/CommandAdapt";
import { defaultImageClipperConfig } from "./config";
import { mergeOptions, nextTick, parseContainer } from "./utils";

/**
 * @description 图片裁剪器
 */
class ImageClipper {
	command: Command;
	getContainer: () => Element;
	event!: EventBus<EventBusMap>;

	constructor(options: ImageClipperConfig) {
		// 处理 options
		const stage = mergeOptions(defaultImageClipperConfig, options);

		// 替换 store
		store.replaceStage(stage);

		// 初始化事件系统
		this.initEventSystem();

		// 解析并设置容器
		const container = parseContainer(options.container);
		this.getContainer = () => container;

		// 初始化 DOM 容器
		this.initDomContainer();

		// 初始化绘制类
		const draw = new Draw(this, this.event);

		// 初始化命令
		this.command = new Command(new CommandAdapt(draw));

		// 初始化完成
		this.dispatchEvent("afterInit");
	}

	/**
	 * 初始化事件系统
	 */
	private initEventSystem() {
		this.event = new EventBus<EventBusMap>();
		// emit beforeInit
		this.dispatchEvent("beforeInit");
	}

	/**
	 * @description 统一的派发事件中心
	 */
	public dispatchEvent<K extends string & keyof EventBusMap>(
		eventName: K,
		payload?: EventBusMap[K] extends (payload: infer P) => void ? P : never
	) {
		nextTick(() => this.event.isSubscribe(eventName) && this.event.emit(eventName, payload));
	}

	/**
	 * 初始化 DOM 容器
	 */
	private initDomContainer() {
		const container = this.getContainer();

		if (!container) {
			throw new Error("container is not exist");
		}

		// 添加基础样式类
		container.classList.add("image-clipper-container");

		// 创建 Konva 容器
		const konvaContainer = this.createKonvaContainer();

		// 将 Konva 容器添加到根容器
		container.appendChild(konvaContainer);
	}

	/**
	 * 创建 Konva 容器元素
	 */
	private createKonvaContainer(): HTMLElement {
		const konvaContainer = document.createElement("div");
		konvaContainer.id = "image-clipper-konva-container";
		konvaContainer.classList.add("image-clipper-konva-container");

		// 如果设置了宽度或高度，则应用样式（默认为100%）
		const width = store.getState("width");
		const height = store.getState("height");

		if (width) konvaContainer.style.width = `${width}px`;
		if (height) konvaContainer.style.height = `${height}px`;

		return konvaContainer;
	}
}

export { ImageClipper };
export default ImageClipper;

// 导出类型
export type { ImageClipperConfig };
