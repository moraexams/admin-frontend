import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "../../services/authServices";

const Loader = () => {
	const token = localStorage.getItem("token");
	const navigate = useNavigate();

	// biome-ignore lint/correctness/useExhaustiveDependencies: no need
	useEffect(() => {
		if (!token) {
			navigate("/auth/signin");
		}
		validateToken().catch(() => {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			localStorage.removeItem("username");
			navigate("/auth/signin");
		});
	}, []);

	return (
		<div className="flex h-screen items-center justify-center">
			<div className="size-12 spinner" />
		</div>
	);
};

export default Loader;
