import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(() => {
	const buildTime = new Date().toISOString(); // UTC timestamp

	return {
		plugins: [react()],
		define: {
			"import.meta.env.BUILD_TIME": JSON.stringify(buildTime),
		},
	};
});
