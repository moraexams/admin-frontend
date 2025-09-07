import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteUser } from "@/services/userService";
import type { User } from "@/types/types";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

interface Props {
	isOpen: boolean;
	selectedUser: User | null;
	onFinished?: () => void;
	onClose: () => void;
}

export default function DeleteUser({
	isOpen,
	selectedUser,
	onFinished,
	onClose,
}: Props) {
	function onConfirm() {
		if (!selectedUser?.id) return;
		deleteUser(selectedUser.id)
			.then(() => {
				onFinished?.();
				onClose();
			})
			.catch((error) => {
				console.error("Error deleting user:", error);
				toast.error(
					typeof error === "string" ? error : "Failed to delete user.",
				);
			});
	}

	return (
		<AlertDialog open={isOpen} onOpenChange={(v) => (v ? null : onClose())}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action is <b>irreversible</b>. User{" "}
						<b>{selectedUser?.username}</b> will permanently be deleted.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={close}>Cancel</AlertDialogCancel>
					<Button variant="destructive" onClick={onConfirm}>
						Confirm
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
