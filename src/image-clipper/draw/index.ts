import Konva from "konva";
import ImageClipper from "..";
import { EventBus } from "../event/EventBus";
import { EventBusMap } from "../interface/EventBusMap";
import { HistoryManager } from "../history/HistoryManager";

export class Draw {
	private stage: Konva.Stage;
	private layer: Konva.Layer;
	private history: HistoryManager;

	constructor(private imageClipper: ImageClipper, private event: EventBus<EventBusMap>) {
		const root = this.imageClipper.getContainer();
		const container = root.querySelector("#image-clipper-konva-container");

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

		// 创建 layer
		this.layer = new Konva.Layer({ id: "mainLayer" });

		// 添加到 stage 上
		this.stage.add(this.layer);

		// ⚠️ 创建历史记录管理器时，需要初始化一个默认空白图层
		this.history = new HistoryManager(this);

		// 更新视图
		this.render();
	}

	/**
	 * @description 渲染容器
	 */
	public render(options?: { patchHistory?: boolean }) {
		if (!this.stage) return;

		const { patchHistory = true } = options || {};

		// 如果明确的指定了不记录历史记录，则不记录历史记录
		if (patchHistory !== false && this.history) {
			this.history.patchHistory();
		}

		this.layer.batchDraw();
		this.stage.batchDraw();
	}

	// getter
	public getEvent = () => this.event;
	public getStage = () => this.stage;
	public getLayer = () => this.layer;
	public getImageClipper = () => this.imageClipper;
}
