import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { editUser } from "@/services/userService";
import type { User } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import {
	ROLE_COORDINATOR,
	ROLE_DISTRICTS_COORDINATOR,
	ROLE_EXAM_COORDINATOR,
	ROLE_FINANCE_TEAM_MEMBER,
	ROLE_MARKETING_COORDINATOR,
	ROLE_PRESIDENT,
	ROLE_SECRETARY,
	ROLE_TREASURER,
	ROLE_USER,
	ROLE_VICE_PRESIDENT,
	ROLE_VICE_SECRETARY,
} from "../common/roles";

const AVAILABLE_ROLES_FOR_SETTING = [
	ROLE_PRESIDENT,
	ROLE_VICE_PRESIDENT,
	ROLE_SECRETARY,
	ROLE_VICE_SECRETARY,
	ROLE_TREASURER,
	ROLE_DISTRICTS_COORDINATOR,
	ROLE_EXAM_COORDINATOR,
	ROLE_MARKETING_COORDINATOR,
	ROLE_FINANCE_TEAM_MEMBER,
	ROLE_USER,
	ROLE_COORDINATOR,
] as const;

function isAvailableRole(
	role: string | undefined,
): role is (typeof AVAILABLE_ROLES_FOR_SETTING)[number] {
	if (!role) return false;
	return AVAILABLE_ROLES_FOR_SETTING.includes(
		role as (typeof AVAILABLE_ROLES_FOR_SETTING)[number],
	);
}

interface Props {
	selectedUser: User | null;
	onCancel: () => void;
	onFinished: () => void;
}

const schema = z.object({
	approved: z.boolean(),
	role: z.enum(AVAILABLE_ROLES_FOR_SETTING),
});

export default function EditUser({
	selectedUser,
	onCancel,
	onFinished,
}: Props) {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			approved: selectedUser?.approved ?? false,
			role: isAvailableRole(selectedUser?.role) ? selectedUser.role : ROLE_USER,
		},
	});

	useEffect(() => {
		if (selectedUser) {
			form.reset({
				approved: selectedUser.approved,
				role: isAvailableRole(selectedUser.role)
					? selectedUser.role
					: ROLE_USER,
			});
		}
	}, [selectedUser]);

	const [isLoading, setLoading] = useState(false);

	async function onSubmit(values: z.infer<typeof schema>) {
		if (!selectedUser) return;
		setLoading(true);
		try {
			await editUser({
				...selectedUser,
				...values,
			});
			onFinished();
		} catch (error) {
			console.log(error);
			if (typeof error === "string") {
				toast.error(error);
			} else {
				toast.error("Failed to update user");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog
			open={!!selectedUser}
			onOpenChange={() => (selectedUser === null ? null : onCancel())}
		>
			<DialogContent className="sm:max-w-2xl w-full">
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
					{selectedUser === null ? null : (
						<DialogDescription className="mb-5">
							You are editing the user: <b>{selectedUser.username}</b>.<br />{" "}
							You cannot edit their username or name.
						</DialogDescription>
					)}
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="approved"
							render={({ field }) => (
								<FormItem className="grid grid-cols-[1fr_auto] gap-0 items-center mb-4">
									<FormLabel className="cursor-pointer font-semibold text-base">
										Approved
									</FormLabel>
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={(checked) => field.onChange(checked)}
											className="size-5 cursor-pointer col-start-2 row-start-1 row-span-2"
										/>
									</FormControl>
									<FormDescription>
										Only approved members can login.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem className="grid grid-cols-[1fr_auto] gap-0 items-center mb-4">
									<FormLabel className="cursor-pointer font-semibold text-base">
										Role
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl className="row-span-full">
											<SelectTrigger className="col-start-2 row-start-1 row-span-2">
												<SelectValue placeholder="Role" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{AVAILABLE_ROLES_FOR_SETTING.map((role) => (
												<SelectItem key={role} value={role}>
													{role}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription>
										Controls how much the user can do.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex gap-2">
							<Button
								variant="destructive"
								type="button"
								onClick={onCancel}
								className="ml-auto"
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Loading..." : "Save"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
