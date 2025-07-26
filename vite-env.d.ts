interface ImportMetaEnv {
	readonly VITE_BACKEND_URL: string;
	readonly LATEST_GIT_COMMIT: string;
	readonly BUILD_TIME: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
