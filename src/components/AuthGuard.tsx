import { authBus } from "@/lib/authBus";
import {
	LOCAL_STORAGE__ROLE,
	LOCAL_STORAGE__TOKEN,
	LOCAL_STORAGE__USER,
	LOCAL_STORAGE__USERNAME,
	LOCAL_STORAGE__USER_ID,
	LOCAL_STORAGE_ASSOCIATED_DISTRICT,
} from "@/services/authServices";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthGuard() {
	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = authBus.subscribe(() => {
			localStorage.removeItem(LOCAL_STORAGE__TOKEN);
			localStorage.removeItem(LOCAL_STORAGE__USER);
			localStorage.removeItem(LOCAL_STORAGE__USERNAME);
			localStorage.removeItem(LOCAL_STORAGE__USER_ID);
			localStorage.removeItem(LOCAL_STORAGE__ROLE);
			localStorage.removeItem(LOCAL_STORAGE_ASSOCIATED_DISTRICT);

			const path = window.location.pathname;
			const isAuthPath =
				path === "/reset-password" ||
				path === "/sign-in" ||
				path === "/sign-up";
			if (!isAuthPath) {
				navigate("/sign-in");
			}
		});

		return () =>{
			unsubscribe;
		}
		
	}, [navigate]);

	return null;
}
