import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteTempStudent } from "@/services/tempStudent.service";
import type { TemporaryStudent } from "@/types/manual-admissions";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Props {
	isOpen: boolean;
	selectedTempStudent: TemporaryStudent | null;
	onFinished?: () => void;
	onClose: () => void;
}

export default function ViewTempStudent({
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
		<Dialog open={isOpen} onOpenChange={(v) => (v ? null : onClose())}>
			{selectedTempStudent === null ? (
				<DialogContent>
					<DialogHeader>
						<DialogTitle>No Student Selected</DialogTitle>
						<DialogDescription>This doesn't look right.</DialogDescription>
					</DialogHeader>
				</DialogContent>
			) : (
				<DialogContent className="sm:max-w-4xl w-full">
					<DialogHeader>
						<DialogTitle>View Student</DialogTitle>
						<DialogDescription>
							Here are the details of the unverified student.
						</DialogDescription>
					</DialogHeader>

					<div className="gap-y-3 gap-x-3 grid grid-cols-[1fr_1fr_2fr] grid-rows-[repeat(6,auto)]">
						<div className="col-start-3 row-start-1 row-span-full">
							<Skeleton className="h-full w-full rounded-lg" />
						</div>
						<div className="col-span-2">
							<Label className="mb-1">Full Name</Label>
							<Input readOnly value={selectedTempStudent.full_name} />
						</div>
						<div>
							<Label className="mb-1">NIC</Label>
							<Input readOnly value={selectedTempStudent.nic} />
						</div>
						<div>
							<Label className="mb-1">Stream</Label>
							<Input readOnly value={selectedTempStudent.stream} />
						</div>
						<div>
							<Label className="mb-1">Medium</Label>
							<Input readOnly value={selectedTempStudent.medium} />
						</div>
						<div>
							<Label className="mb-1">Gender</Label>
							<Input readOnly value={selectedTempStudent.gender} />
						</div>
						<div>
							<Label className="mb-1">Ranking District</Label>
							<Input readOnly value={selectedTempStudent.rank_district} />
						</div>
						<div>
							<Label className="mb-1">Exam District</Label>
							<Input readOnly value={selectedTempStudent.exam_district} />
						</div>
						<div className="col-span-2">
							<Label className="mb-1">Exam Centre</Label>
							<Input readOnly value={selectedTempStudent.exam_centre} />
						</div>
					</div>
					<div className="flex">
						<p className="max-w-[48ch] text-muted-foreground">
							Once you click "Verify", you will be the sole responsibility for
							the details and payment of this student.
						</p>
						<Button className="ml-auto" disabled>
							Verify
						</Button>
					</div>
				</DialogContent>
			)}
		</Dialog>
	);
}
