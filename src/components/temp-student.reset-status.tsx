import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { resetTempStudentStatus } from "@/services/tempStudent.service";
import type { TemporaryStudent } from "@/types/manual-admissions";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

interface Props {
	isOpen: boolean;
	selectedTempStudent: TemporaryStudent | null;
	onFinished?: () => void;
	onClose: () => void;
}

export default function ResetTempStudent({
	isOpen,
	selectedTempStudent,
	onFinished,
	onClose,
}: Props) {
	function onConfirm() {
		if (!selectedTempStudent?.nic) return;
		resetTempStudentStatus(selectedTempStudent.nic)
			.then(() => {
				onFinished?.();
				onClose();
			})
			.catch((error) => {
				console.error("Error resetting temp student status:", error);
				toast.error(
					typeof error === "string"
						? error
						: "Failed to reset temp student status.",
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
						<b>{selectedTempStudent?.nic}</b> will be changed to being{" "}
						<b>
							not{" "}
							{selectedTempStudent?.checked_by !== null
								? `checked ${selectedTempStudent?.checked_by}`
								: selectedTempStudent?.rejected_by !== null
									? `rejected ${selectedTempStudent.rejected_by}`
									: "UNKNOWN"}
						</b>
						.
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
