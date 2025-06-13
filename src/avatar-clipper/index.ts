import "./style/index.css";
import { Draw } from "./draw";
import { store } from "./store";
import { Command } from "./command/Command";
import { EventBus } from "./event/EventBus";
import { getDefaultConfig } from "./config";
import { AvatarClipperConfig } from "./interface";
import { EventBusMap } from "./interface/EventMap";
import { CommandAdapt } from "./command/CommandAdapt";
import { mergeOptions, parseContainer } from "./utils";

/**
 * @description 图片裁剪器
 */
class AvatarClipper {
	command!: Command;
	event!: EventBus<EventBusMap>;
	getOptions: () => AvatarClipperConfig;

	constructor(options: AvatarClipperConfig) {
		this.getOptions = () => options;

		// 初始化配置
		this.initConfiguration(options);

		// 初始化事件系统
		this.initEventSystem();

		// 初始化 DOM 容器
		this.initDomContainer();

		// 初始化绘制类和命令
		const draw = this.initDrawAndCommand();

		// 触发初始化完成事件
		this.dispatchInitializationEvents(draw);
	}

	/**
	 * 初始化配置
	 * @param options 用户传入的配置对象
	 */
	private initConfiguration(options: AvatarClipperConfig) {
		// 合并用户传入 options 与默认配置，并存储到 store 中
		const stage = mergeOptions(getDefaultConfig(), options);
		// 替换 store
		store.replaceStage(stage);
	}

	/**
	 * 初始化事件系统
	 */
	private initEventSystem() {
		this.event = new EventBus<EventBusMap>();
	}

	/**
	 * 初始化 AvatarClipper 容器
	 */
	private initDomContainer() {
		const optionsContainer = store.getState("container");
		const container = parseContainer(optionsContainer);

		if (!container) {
			throw new Error("AvatarClipper: 容器未找到，请检查传入的容器选择器或元素是否正确。");
		}

		// 添加基础样式类
		container.classList.add("avatar-clipper-container");

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
		konvaContainer.id = "avatar-clipper-konva-container";
		konvaContainer.classList.add("avatar-clipper-konva-container");

		// 如果设置了宽度或高度，则应用样式（默认为100%）
		const width = store.getState("width");
		const height = store.getState("height");

		if (width) konvaContainer.style.width = `${width}px`;
		if (height) konvaContainer.style.height = `${height}px`;

		return konvaContainer;
	}

	/**
	 * 初始化绘制类和命令
	 */
	private initDrawAndCommand() {
		// 初始化绘制类
		const draw = new Draw(this);

		// 初始化命令
		this.command = new Command(new CommandAdapt(draw));

		return draw;
	}

	/**
	 * 触发初始化完成事件
	 */
	private dispatchInitializationEvents(draw: Draw) {
		const currentResult = <string>draw.getEventResponder().getResult("string");
		this.event.dispatchEvent("afterInit", currentResult);
		this.event.dispatchEvent("preview", currentResult);
	}
}

export { AvatarClipper };
export default AvatarClipper;

// 导出类型
export type { EventBusMap };
export * from "./interface";
