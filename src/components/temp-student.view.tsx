import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	rejectTempStudent,
	verifyTempStudent,
} from "@/services/tempStudent.service";
import type { TemporaryStudent } from "@/types/manual-admissions";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import PreviewPaymentLink from "./preview-payment-link";

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
	const [rejectionReason, setRejectionReason] = useState<string>("");

	function onReject() {
		if (!selectedTempStudent?.nic) return;
		rejectTempStudent(selectedTempStudent.nic, rejectionReason)
			.then(() => {
				onFinished?.();
				onClose();
				setRejectionReason("");
			})
			.catch((error) => {
				console.error("Error verifying student:", error);
				toast.error(
					typeof error === "string" ? error : "Failed to verify student.",
				);
			});
	}

	function onVerify() {
		if (!selectedTempStudent?.nic) return;
		verifyTempStudent(selectedTempStudent.nic)
			.then(() => {
				onFinished?.();
				onClose();
				setRejectionReason("");
			})
			.catch((error) => {
				console.error("Error verifying student:", error);
				toast.error(
					typeof error === "string" ? error : "Failed to verify student.",
				);
			});
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(v) => {
				if (v) {
					return null;
				}
				setRejectionReason("");
				onClose();
			}}
		>
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
						<div className="col-start-3 row-start-1 row-span-full flex flex-col">
							<PreviewPaymentLink link={selectedTempStudent.payment_link} />

							<a
								href={import.meta.env.VITE_BACKEND_URL.concat(
									selectedTempStudent.payment_link,
								)}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button className="mt-2 w-full">
									Open in New Tab
									<ExternalLink />
								</Button>
							</a>
							{/* <Skeleton className="h-full w-full rounded-lg" /> */}
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

						{selectedTempStudent.rejected_by === null &&
						selectedTempStudent.checked_by === null ? (
							<div className="col-span-2 mt-5">
								<Label className="mb-1">Rejection Reason</Label>
								<Textarea
									onChange={(v) => {
										setRejectionReason(v.target.value.trim());
									}}
								/>
							</div>
						) : null}
					</div>
					<div className="flex">
						<p
							className="max-w-[48ch] text-muted-foreground"
							dangerouslySetInnerHTML={{
								__html: `${
									selectedTempStudent.checked_by !== null
										? `Already verified by ${selectedTempStudent.checked_by}.`
										: selectedTempStudent.rejected_by !== null
											? `Already rejected by ${selectedTempStudent.rejected_by} because:<br/><b><i>${selectedTempStudent.rejection_reason}</i></b>`
											: `Once you click "Verify", you will be the sole responsibility for the details and payment of this student.`
								}`,
							}}
						></p>
						<Button
							className="ml-auto"
							variant="destructive"
							disabled={
								selectedTempStudent.checked_by !== null ||
								selectedTempStudent.rejected_by !== null ||
								rejectionReason.trim() === ""
							}
							onClick={onReject}
						>
							Reject
						</Button>
						<Button
							className="ml-2"
							onClick={onVerify}
							disabled={
								selectedTempStudent.checked_by !== null ||
								selectedTempStudent.rejected_by !== null ||
								rejectionReason.trim() !== ""
							}
						>
							Verify
						</Button>
					</div>
				</DialogContent>
			)}
		</Dialog>
	);
}
