import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@components": resolve(__dirname, "/src/components"),
			"@lib": resolve(__dirname, "/src/lib"),
			"@store": resolve(__dirname, "/src/store"),
		},
	},
});
