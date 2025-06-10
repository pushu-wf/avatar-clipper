// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";
import backTop from "./components/backTop.vue";
import "./custom/index.css";

/** @type {import('vitepress').Theme} */
export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		// 注册自定义全局组件
		app.component("backTop", backTop);
	},
};
