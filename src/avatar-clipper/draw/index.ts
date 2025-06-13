import Konva from "konva";
import AvatarClipper from "..";
import { store } from "../store";
import { Stage } from "konva/lib/Stage";
import { parseContainer } from "../utils";
import { EventResponder } from "./EventResponder";
import { LayerManager } from "./Layer/LayerManager";
import { imageWheel } from "../event/handlers/image-wheel";
import { contextmenu } from "../event/handlers/contextmenu";

/**
 * @description 绘制类 - 实现图层控制，绘制结果导出等
 */
export class Draw {
	private stage: Stage;
	private isDestroy = false;
	private layerManager: LayerManager;
	private eventResponder: EventResponder;

	constructor(private AvatarClipper: AvatarClipper) {
		// 获取 konva 挂载节点
		const root = parseContainer(store.getState("container"));
		const container = root.querySelector("#avatar-clipper-konva-container");

		if (!container) {
			throw new Error("container is not exist");
		}

		// 确保 container 是 HTMLDivElement 类型
		if (!(container instanceof HTMLDivElement)) {
			throw new Error("container is not a HTMLDivElement");
		}

		// konva stage 的宽高与容器一致
		const { width, height } = container.getBoundingClientRect();

		// 创建 stage
		this.stage = new Konva.Stage({ container, width, height });

		// 创建事件相应器
		this.eventResponder = new EventResponder(this);

		// 创建图层控制器
		this.layerManager = new LayerManager(this);

		// 如果用户传递了 image src 属性，则默认初始化图片
		const src = store.getState("image")?.src;
		if (src) this.eventResponder.setImage(src);

		// 给整个 stage 添加 wheel 事件，实现图片的缩放控制
		this.stage.on("wheel", (e) => imageWheel(e, this));
		this.stage.on("wheel", this.eventResponder.patchPreviewEvent.bind(this.eventResponder));

		// stage 新增右键菜单
		this.stage.on("contextmenu", (e) => contextmenu(e));
	}

	/**
	 * @description 销毁容器
	 */
	public destroy() {
		if (!this.stage) return;

		// 销毁 stage
		this.stage.destroy();

		this.isDestroy = true;

		// 清空 root 容器
		const avatarClipper = this.getAvatarClipper();
		const { container } = avatarClipper.getOptions();
		const root = parseContainer(container);
		if (root) root.innerHTML = "";

		// 触发空的 preview 结束事件
		avatarClipper.event.dispatchEvent("preview", "");
	}

	// getter
	public getStage = () => this.stage;
	public getIsDestroy = () => this.isDestroy;
	public getLayerManager = () => this.layerManager;
	public getAvatarClipper = () => this.AvatarClipper;
	public getEventResponder = () => this.eventResponder;
}
