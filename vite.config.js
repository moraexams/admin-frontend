import path from "path";
import tailwindcss from "@tailwindcss/vite"
import { exec } from "node:child_process";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

async function getLatestCommit() {
	return new Promise((resolve, reject) => {
		exec("git rev-parse HEAD", (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}
			if (stderr) {
				reject(new Error(stderr));
				return;
			}
			resolve(stdout.trim());
		});
	});
}

// https://vitejs.dev/config/
export default defineConfig(async () => {
	const buildTime = new Date().toISOString(); // UTC timestamp
	const commitHash = await getLatestCommit();

	return {
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			}
		},
		define: {
			"import.meta.env.BUILD_TIME": JSON.stringify(buildTime),
			"import.meta.env.LATEST_GIT_COMMIT": JSON.stringify(commitHash),
		},
	};
});
