import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { humanReadableTimeRemaining } from "@/lib/utils";
import {
	type PasswordResetDetails,
	getPasswordResetDetails,
} from "@/services/userService";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import Logo from "../../images/logo/logo.png";

const schema = z
	.object({
		username: z.string().min(1, "Username is required"),
		password: z.string().min(8, "Password must be at least 8 characters long"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
	});

const PasswordReset: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [passwordResetDetails, setPasswordResetDetails] =
		useState<PasswordResetDetails | null>(null);

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			username: passwordResetDetails?.username ?? "",
			password: "",
			confirmPassword: "",
		},
	});

	const resetId = new URLSearchParams(window.location.search).get("reset_id");

	useEffect(() => {
		if (!resetId) {
			toast.error("The password reset link is invalid.");
			return;
		}
		getPasswordResetDetails(resetId)
			.then((data) => {
				setPasswordResetDetails(data);
				form.reset({ username: data.username });
			})
			.catch((error) => {
				toast.error(error);
			});
	}, []);

	function onSubmit(data: z.infer<typeof schema>) {
		console.log(data);
	}

	return (
		<main className="mx-auto h-screen grid grid-cols-1 grid-rows-[auto_1fr] lg:grid-cols-2 lg:grid-rows-1 lg:items-center max-w-[min(80vw,1400px)] gap-y-8">
			<div className="py-15 lg:py-0 text-center">
				<div className="mb-5.5 inline-block">
					<img className="h-28 lg:h-36" src={Logo} alt="Logo" />
				</div>

				<p className="max-w-[28ch] text-center mx-auto">
					Dashboard for managing students, marks and exam for Mora Exams.
				</p>
			</div>

			<div className="w-full mx-auto max-w-[500px]">
				<h2 className="mb-2 text-2xl font-bold text-center xl:text-left sm:text-title-xl2">
					{passwordResetDetails ? "Reset Password" : "Loading..."}
				</h2>
				<Alert variant={resetId === null ? "destructive" : "default"}>
					<TriangleAlert />
					<AlertTitle className="text-base">
						{resetId === null ? "Error!" : "Heads up!"}
					</AlertTitle>
					<AlertDescription>
						{resetId === null
							? "The link you have seems to be invalid."
							: passwordResetDetails === null
								? "Loading..."
								: `Using this link, you can only reset your password once. The reset link is valid for another ${humanReadableTimeRemaining(passwordResetDetails.time_remaining)}.`}
					</AlertDescription>
				</Alert>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-3 mt-4"
					>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input disabled {...field} className="h-12" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							disabled={!passwordResetDetails}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input {...field} className="h-12" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="confirmPassword"
							disabled={!passwordResetDetails}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input {...field} className="h-12" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="my-5">
							<Button
								type="submit"
								className="w-full text-base"
								disabled={loading}
							>
								Reset
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</main>
	);
};

export default PasswordReset;
