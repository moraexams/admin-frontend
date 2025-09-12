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
	recheckTempStudent,
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

export default function ViewRejectedTempStudent({
	isOpen,
	selectedTempStudent,
	onFinished,
	onClose,
}: Props) {
	const [recheckReason, setRecheckReason] = useState<string>("");

	function onVerify() {
		if (!selectedTempStudent?.nic) return;
		if (recheckReason.trim() === "") {
			toast.error("Please provide a reason for rechecking.");
			return;
		}
		recheckTempStudent(selectedTempStudent.nic, recheckReason)
			.then(() => {
				onFinished?.();
				onClose();
				setRecheckReason("");
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
				setRecheckReason("");
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
						<DialogTitle>View Rejected Student</DialogTitle>
						<DialogDescription>
							You are viewing a rejected student.
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
							<Input
								readOnly
								className="pointer-events-none"
								value={selectedTempStudent.full_name}
							/>
						</div>
						<div>
							<Label className="mb-1">NIC</Label>
							<Input
								readOnly
								className="pointer-events-none"
								value={selectedTempStudent.nic}
							/>
						</div>
						<div>
							<Label className="mb-1">Stream</Label>
							<Input
								readOnly
								className="pointer-events-none"
								value={selectedTempStudent.stream}
							/>
						</div>
						<div className="col-span-1">
							<Label className="mb-1">Exam Centre</Label>
							<Input
								readOnly
								className="pointer-events-none"
								value={selectedTempStudent.exam_centre}
							/>
						</div>
						<div className="col-span-1">
							<Label className="mb-1">Phone No.</Label>
							<Input
								readOnly
								className="pointer-events-none"
								value={selectedTempStudent.telephone_no}
							/>
						</div>
						{selectedTempStudent?.rejected_by ? (
							<>
								<div className="col-span-2">
									<Label className="mb-1">Rejected By</Label>
									<Input
										readOnly
										className="pointer-events-none"
										value={selectedTempStudent.rejected_by}
									/>
								</div>
								<div className="col-span-2">
									<Label className="mb-1">Reason for Rejection</Label>
									<Textarea
										readOnly
										className="pointer-events-none resize-none"
									>
										{selectedTempStudent.rejection_reason}
									</Textarea>
								</div>
							</>
						) : null}

						{selectedTempStudent.rejected_by !== null &&
						selectedTempStudent.checked_by === null &&
						selectedTempStudent.rechecked_by === null ? (
							<div className="col-span-2 mt-5">
								<Label className="mb-1">Rechecked </Label>
								<Textarea
									onChange={(v) => {
										setRecheckReason(v.target.value.trim());
									}}
								/>
							</div>
						) : null}
					</div>
					<div className="flex">
						<p className="text-sm text-muted-foreground">
							You can verify this student after contacting and manually verifying them.
						</p>
						{/* <p
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
						/> */}
						<Button
							className="ml-auto"
							onClick={onVerify}
							disabled={
								selectedTempStudent.checked_by !== null ||
								selectedTempStudent.rechecked_by !== null ||
								recheckReason.trim() === ""
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
