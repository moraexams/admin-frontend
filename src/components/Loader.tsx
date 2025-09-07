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
		validateToken().catch(() => {
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
