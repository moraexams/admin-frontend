interface ImportMetaEnv {
	readonly VITE_BACKEND_URL: string;
	readonly VITE_GIT_COMMIT: string;
	readonly BUILD_TIME: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
