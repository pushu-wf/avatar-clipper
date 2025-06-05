import { MD5 } from "crypto-js";

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
 * @description 对传入的内容进行 MD5 操作
 */
function md5(content: string) {
	return MD5(content).toString();
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

export { parseContainer, nextTick, md5, mergeOptions };
