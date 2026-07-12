import { AxiosError } from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "../services/authServices";

const Loader = () => {
	const token = localStorage.getItem("token");
	const navigate = useNavigate();

	// biome-ignore lint/correctness/useExhaustiveDependencies: no need
	useEffect(() => {
		const path = window.location.pathname;
		const isAuthPath =
			path == "/reset-password" || path == "/sign-in" || path === "/sign-up";
		if (!token && !isAuthPath) {
			navigate("/sign-in");
			return;
		}
		validateToken().catch((error) => {
			// Only treat an actual invalid/expired token (401) as a logout reason.
			// Transient failures (rate limiting, server errors, network issues)
			// should not wipe the session.
			const isUnauthorized =
				error instanceof AxiosError && error.response?.status === 401;

			if (!isUnauthorized) {
				console.error("Token validation failed (not logging out):", error);
				return;
			}

			localStorage.removeItem("token");
			localStorage.removeItem("user");
			localStorage.removeItem("username");

			if (!isAuthPath) {
				navigate("/sign-in");
			}
		});
	}, []);

	return (
		<div className="flex h-screen items-center justify-center">
			<div className="size-12 spinner" />
		</div>
	);
};

export default Loader;
