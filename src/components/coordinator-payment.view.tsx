import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { CoordinatorPayment } from "@/types/types";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import PreviewPaymentLink from "./preview-payment-link";
import { CurrencyFormatter } from "@/services/utils";

interface Props {
	isOpen: boolean;
	selectedCoordinatorPayment: CoordinatorPayment | null;
	onFinished?: () => void;
	onClose: () => void;
}

export default function ViewCoordinatorPayment({
	isOpen,
	selectedCoordinatorPayment,
	onFinished,
	onClose,
}: Props) {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	function onVerify() {
		if (isLoading) return;
		setIsLoading(true);
		toast.loading("Verifying Coordinator Payment...");
		// verifyTempStudent(selectedTempStudent.nic)
		// 	.then(() => {
		// 		toast.dismiss();
		// 		onFinished?.();
		// 		onClose();
		// 		setRejectionReason("");
		// 	})
		// 	.catch((error) => {
		// 		toast.dismiss();
		// 		console.error("Error verifying student:", error);
		// 		toast.error(
		// 			typeof error === "string" ? error : "Failed to verify student.",
		// 		);
		// 	})
		// 	.finally(() => {
		// 		setIsLoading(false);
		// 	});
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(v) => {
				if (v) {
					return null;
				}
				onClose();
			}}
		>
			{selectedCoordinatorPayment === null ? (
				<DialogContent>
					<DialogHeader>
						<DialogTitle>No Coordinator Payment Selected</DialogTitle>
						<DialogDescription>This doesn't look right.</DialogDescription>
					</DialogHeader>
				</DialogContent>
			) : (
				<DialogContent className="sm:max-w-4xl w-full">
					<DialogHeader>
						<DialogTitle>View Coordinator Payment</DialogTitle>
						<DialogDescription>
							Here are the details of the unverified coordinator payment.
						</DialogDescription>
					</DialogHeader>

					<div className="gap-y-5 gap-x-3 grid grid-cols-[1fr_1fr_2fr] grid-rows-[repeat(6,auto)]">
						<div className="col-span-2">
							<Label className="mb-1">Added By</Label>
							<span className="text-lg font-medium">{selectedCoordinatorPayment.added_by}</span>
						</div>

						<div className="col-span-2">
							<Label className="mb-1">Coordinator's Districts</Label>
							<span className="text-lg font-medium">{selectedCoordinatorPayment.districts || "N/A"}</span>
						</div>

						<div className="col-span-2">
							<Label className="mb-1">Coordinator's Contact No</Label>
							<span className="text-lg font-medium">{selectedCoordinatorPayment.contact_no || "N/A"}</span>
						</div>

						<div className="col-span-2">
							<Label className="mb-1">Amount</Label>
							<span className="text-2xl font-medium">{CurrencyFormatter.format(selectedCoordinatorPayment.amount)}</span>
						</div>

						<div className="col-span-2">
							<Label className="mb-1">Student Count</Label>
							<span className="text-xl font-medium">{selectedCoordinatorPayment.student_count || 0}</span>
						</div>

						<div className="col-start-3 row-start-1 row-span-full flex flex-col">
							<PreviewPaymentLink
								link={selectedCoordinatorPayment.payment_link}
							/>

							<a
								href={import.meta.env.VITE_BACKEND_URL.concat(
									selectedCoordinatorPayment.payment_link,
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
					</div>
					<div className="flex">
						<p className="max-w-[4ch]">
						</p>
						{/* <p
							className="max-w-[48ch] text-muted-foreground"
							dangerouslySetInnerHTML={{
								__html: `${
									selectedCoordinatorPayment.checked_by !== null
										? `Already verified by ${selectedCoordinatorPayment.checked_by}.`
										: selectedCoordinatorPayment.rejected_by !== null
											? `Already rejected by ${selectedCoordinatorPayment.rejected_by} because:<br/><b><i>${selectedCoordinatorPayment.rejection_reason}</i></b>`
											: `Once you click "Verify", you will be the sole responsibility for the details and payment of this student.`
								}`,
							}}
						/> */}
						<Button
							className="ml-auto"
							onClick={onVerify}
							title={
								isLoading
									? `Loading...`
									: `Verify this payment made by a coordinator.`
							}
							disabled={true}
						>
							Verify
						</Button>
					</div>
				</DialogContent>
			)}
		</Dialog>
	);
}
