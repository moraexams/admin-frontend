import { ROLE_COORDINATOR } from "@/common/roles";
import AuthenticationBanner from "@/components/authentication-banner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	LOCAL_STORAGE__ROLE,
	LOCAL_STORAGE__TOKEN,
	login,
} from "@/services/authServices";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem(LOCAL_STORAGE__TOKEN);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const handleSignIn = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		setLoading(true);
		if (username !== "" && password !== "") {
			await login(username, password)
				.then(() => {
					const role = localStorage.getItem(LOCAL_STORAGE__ROLE);
					if (role === ROLE_COORDINATOR) {
						navigate("/admissions");
					} else {
						navigate("/");
					}
				})
				.catch((error) => {
					setError(error);
					setLoading(false);
				});
		} else if (username === "" || password === "") {
			setError("Please enter your username and password");
			setLoading(false);
		}
	};

	useEffect(() => {
		const role = localStorage.getItem(LOCAL_STORAGE__ROLE);

		if (token) {
			if (role === ROLE_COORDINATOR) {
				navigate("/admissions");
			} else {
				navigate("/");
			}
		}
	}, [token, navigate]);

	return (
		<main className="mx-auto h-screen grid grid-cols-1 grid-rows-[auto_1fr] lg:grid-cols-2 lg:grid-rows-1 lg:items-center max-w-[min(80vw,1400px)] gap-y-8">
			<AuthenticationBanner />

			<div className="w-full mx-auto max-w-[500px]">
				<h2 className="mb-9 text-2xl font-bold text-center xl:text-left sm:text-title-xl2">
					Sign In to Mora Exams
				</h2>

				<form>
					<div className="mb-4">
						<Label htmlFor="username" className="mb-2">
							Username
						</Label>
						<Input
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							type="text"
							placeholder="Enter your username"
							className="py-3 !h-auto pl-5"
						/>
					</div>

					<div className="mb-6">
						<Label className="mb-2" htmlFor="password">
							Password
						</Label>
						<Input
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type="password"
							placeholder="Enter your password"
							className="py-3 pl-5 !h-auto"
						/>
					</div>

					{error ? (
						<Alert
							variant="destructive"
							className="mb-4 bg-red-200 dark:bg-red-300 dark:text-red-700"
						>
							<AlertTitle>{error}</AlertTitle>
						</Alert>
					) : null}

					<div className="my-5">
						<Button
							type="button"
							onClick={handleSignIn}
							className="w-full"
							disabled={loading}
						>
							{loading ? "Signing In..." : "Sign In"}
						</Button>
					</div>

					<div className="mt-6 text-center">
						<p>
							Don't have any account?{" "}
							<Link to="/sign-up" className="text-primary underline">
								Sign Up
							</Link>
						</p>
					</div>
				</form>
			</div>
		</main>
	);
};

export default SignIn;
