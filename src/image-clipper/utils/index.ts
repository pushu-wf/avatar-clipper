/**
 * @description 节流函数
 * @param fn 要节流的函数
 * @param delay 节流间隔时间（毫秒）
 * @returns 包装后的节流函数
 */
function throttle<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
	let lastCall = 0;
	return ((...args: unknown[]) => {
		const now = Date.now();
		if (now - lastCall >= delay) {
			lastCall = now;
			fn(...args);
		}
	}) as T;
}

/**
 * @description 解析 container
 */
function parseContainer(container: string | HTMLElement) {
	if (typeof container === "string") {
		const dom = document.querySelector(container);
		if (!dom) {
			throw new Error(`${container} is not exist`);
		}
		return dom;
	}

	return container;
}

/**
 * Function to be executed in the next tick
 * @param fn - Function to be executed
 * @description This function uses Promise.then to utilize microtask queue.
 */
function nextTick(fn?: Function) {
	return Promise.resolve().then(() => {
		if (fn) fn();
	});
}

/**
 * @description 对传入的两个对象进行合并操作
 * @param target - 目标对象
 * @param source - 源对象
 * @returns 合并后的对象
 */
function mergeOptions<T>(target: T, source: T) {
	for (const key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			target[key] = source[key];
		}
	}

	return target;
}

/**
 * @description 根据用户传入的 Image src 属性，解析创建 Konva.Image 所需的source（string）字段
 * @param { string | Blob } source
 * @returns { Promise<string> }
 */
function parseImageSource(source: string | Blob) {
	return new Promise<string>((resolve) => {
		if (source instanceof File || source instanceof Blob) {
			// File Blob 相同的处理 创建文件读取器
			const fileReader = new FileReader();
			fileReader.readAsDataURL(source);
			fileReader.onload = () => {
				const value = <string>fileReader.result;
				resolve(value);
			};
		} else resolve(source);
	});
}

export { parseContainer, nextTick, mergeOptions, parseImageSource, throttle };
