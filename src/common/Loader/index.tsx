import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "../../services/authServices";

const Loader = () => {
	const token = localStorage.getItem("token");
	const navigate = useNavigate();

	useEffect(() => {
		if (!token) {
			navigate("/auth/signin");
		}
		validateToken()
			.then((res) => {
				console.log("res", res);
			})
			.catch(() => {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				localStorage.removeItem("username");
				navigate("/auth/signin");
			});
	}, []);
	return (
		<div className="flex h-screen items-center justify-center bg-white">
			<div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
		</div>
	);
};

export default Loader;
