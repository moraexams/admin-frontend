import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../images/logo/logo.png";
import { signup } from "../../services/authServices";

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
						navigate("/auth/signin");
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
			<div className="py-15 lg:py-0 text-center">
				<div className="mb-5.5 inline-block">
					<img className="h-28 lg:h-36" src={Logo} alt="Logo" />
				</div>
				<p className="text-center mx-auto max-w-[28ch]">
					Dashboard for managing students and marks for Mora Exams.
				</p>
			</div>

			<div className="w-full max-w-[500px] mx-auto">
				<h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
					Sign Up to Mora Exams
				</h2>

				<form>
					<div className="mb-4">
						<label
							htmlFor="name"
							className="mb-2.5 block font-medium text-black dark:text-white"
						>
							Name
						</label>
						<div className="relative">
							<input
								id="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter your full name"
								className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
							/>

							<span className="absolute right-4 top-4">
								<svg
									className="fill-current"
									width="22"
									height="22"
									viewBox="0 0 22 22"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g opacity="0.5">
										<path
											d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
											fill=""
										/>
										<path
											d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
											fill=""
										/>
									</g>
								</svg>
							</span>
						</div>
					</div>

					<div className="mb-4">
						<label
							htmlFor="username"
							className="mb-2.5 block font-medium text-black dark:text-white"
						>
							Username
						</label>
						<div className="relative">
							<input
								id="username"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Enter your username"
								className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
							/>

							<span className="absolute right-4 top-4">
								<svg
									className="fill-current"
									width="22"
									height="22"
									viewBox="0 0 22 22"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g opacity="0.5">
										<path
											d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
											fill=""
										/>
									</g>
								</svg>
							</span>
						</div>
					</div>

					<div className="mb-4">
						<label
							htmlFor="password"
							className="mb-2.5 block font-medium text-black dark:text-white"
						>
							Password
						</label>
						<div className="relative">
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
							/>

							<span className="absolute right-4 top-4">
								<svg
									className="fill-current"
									width="22"
									height="22"
									viewBox="0 0 22 22"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g opacity="0.5">
										<path
											d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
											fill=""
										/>
										<path
											d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
											fill=""
										/>
									</g>
								</svg>
							</span>
						</div>
					</div>

					<div className="mb-6">
						<label
							htmlFor="retype-password"
							className="mb-2.5 block font-medium text-black dark:text-white"
						>
							Re-type Password
						</label>
						<div className="relative">
							<input
								id="retype-password"
								type="password"
								value={passwordR}
								onChange={(e) => setPasswordR(e.target.value)}
								placeholder="Re-enter your password"
								className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
							/>

							<span className="absolute right-4 top-4">
								<svg
									className="fill-current"
									width="22"
									height="22"
									viewBox="0 0 22 22"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g opacity="0.5">
										<path
											d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
											fill=""
										/>
										<path
											d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
											fill=""
										/>
									</g>
								</svg>
							</span>
						</div>
					</div>

					{/* Alert */}
					{error && (
						<div className="flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-4 py-4 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-4">
							<div className="w-full">
								<h5 className="font-semibold text-[#B45454]">{error}</h5>
							</div>
						</div>
					)}
					{/* Alert */}

					<div className="my-5">
						<input
							type="submit"
							value="Create account"
							className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
							onClick={handleSignUp}
						/>
					</div>

					<div className="mt-6 text-center">
						<p>
							Already have an account?{" "}
							<Link to="/auth/signin" className="text-primary">
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
