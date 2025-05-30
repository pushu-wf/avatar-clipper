import * as path from "path";
import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig(({ mode }) => {
	const name = "image-clipper";
	if (mode === "lib") {
		return {
			plugins: [
				cssInjectedByJsPlugin({
					styleId: `${name}-style`,
					topExecutionPriority: true,
				}),
				{
					...typescript({
						tsconfig: "./tsconfig.json",
						include: ["./src/image-clipper/**"],
					}),
					apply: "build",
					declaration: true,
					declarationDir: "types/",
					rootDir: "/",
				},
			],
			build: {
				lib: {
					name,
					fileName: name,
					entry: path.resolve(__dirname, "src/image-clipper/index.ts"),
				},
				rollupOptions: {
					output: {
						sourcemap: true,
					},
				},
			},
		};
	}
	return {
		base: `/${name}/`,
		server: {
			host: "0.0.0.0",
			port: 3000,
			open: true,
		},
	};
});
