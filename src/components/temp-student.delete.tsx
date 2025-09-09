import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteTempStudent } from "@/services/tempStudent.service";
import type { TemporaryStudent } from "@/types/manual-admissions";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

interface Props {
	isOpen: boolean;
	selectedTempStudent: TemporaryStudent | null;
	onFinished?: () => void;
	onClose: () => void;
}

export default function DeleteTempStudent({
	isOpen,
	selectedTempStudent,
	onFinished,
	onClose,
}: Props) {
	function onConfirm() {
		if (!selectedTempStudent?.nic) return;
		deleteTempStudent(selectedTempStudent.nic)
			.then(() => {
				onFinished?.();
				onClose();
			})
			.catch((error) => {
				console.error("Error deleting temp student:", error);
				toast.error(
					typeof error === "string" ? error : "Failed to delete temp student.",
				);
			});
	}

	return (
		<AlertDialog open={isOpen} onOpenChange={(v) => (v ? null : onClose())}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action is <b>irreversible</b>.<br />
						<br /> Student <b>{selectedTempStudent?.full_name}</b> with NIC no.{" "}
						<b>{selectedTempStudent?.nic}</b> will permanently be deleted.
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
