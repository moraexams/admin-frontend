import AuthenticationBanner from "@/components/authentication-banner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/services/authServices";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordR, setPasswordR] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSignUp = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		if (name !== "" && username !== "" && password !== "") {
			if (password === passwordR) {
				await signup(name, username, password)
					.then(() => {
						alert("User created successfully");
						navigate("/sign-in");
					})
					.catch((error) => {
						setError(error);
					});
			} else {
				setError("Passwords do not match");
			}
		} else {
			setError("Please fill all the fields");
		}
	};

	useEffect(() => {
		if (token) {
			navigate("/");
		}
	}, [token, navigate]);
	return (
		<main className="mx-auto h-screen grid grid-cols-1 grid-rows-[auto_1fr] gap-y-8 lg:grid-cols-[1fr_1fr] lg:grid-rows-1 lg:items-center max-w-[min(80vw,1400px)]">
			<AuthenticationBanner />

			<div className="w-full max-w-[500px] mx-auto">
				<h2 className="mb-9 text-2xl font-bold sm:text-title-xl2">
					Sign Up to Mora Exams
				</h2>

				<form>
					<div className="mb-4">
						<Label htmlFor="name" className="mb-2">
							Name
						</Label>
						<Input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter your full name"
							className="!h-auto py-3 pl-5"
						/>
					</div>

					<div className="mb-4">
						<Label htmlFor="username" className="mb-2">
							Username
						</Label>
						<Input
							id="username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Enter your username"
							className="!h-auto py-3 pl-5"
						/>
					</div>

					<div className="mb-4">
						<Label htmlFor="password" className="mb-2">
							Password
						</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							className="!h-auto pl-5 py-3"
						/>
					</div>

					<div className="mb-6">
						<Label htmlFor="retype-password" className="mb-2">
							Confirm Password
						</Label>
						<Input
							id="retype-password"
							type="password"
							value={passwordR}
							onChange={(e) => setPasswordR(e.target.value)}
							placeholder="Re-enter your password"
							className="!h-auto pl-5 py-3"
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

					<Button
						type="submit"
						size="lg"
						onClick={handleSignUp}
						className="w-full"
					>
						Create account
					</Button>

					<div className="mt-6 text-center">
						<p>
							Already have an account?{" "}
							<Link to="/sign-in" className="text-primary underline">
								Sign in
							</Link>
						</p>
					</div>
				</form>
			</div>
		</main>
	);
};

export default SignUp;
