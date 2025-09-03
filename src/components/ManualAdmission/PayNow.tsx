import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { payFees } from "@/services/manualAdmissionService";
import { CurrencyFormatter } from "@/services/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const payNowSchema = z.object({
	paymentReceipt: z
		.instanceof(File, {
			message: "Payment slip is required",
		})
		.refine((file) => file.size > 0, { message: "Payment slip is required" })
		.refine((file) => ACCEPTED_TYPES.includes(file.type), {
			message: "Only images and PDFs are allowed",
		}),
});

interface Props {
	amount: number;
	onPaid?: () => void;
}

export default function PayNow(props: Props) {
	const [open, setOpen] = useState(false);
	const form = useForm<z.infer<typeof payNowSchema>>({
		resolver: zodResolver(payNowSchema),
		defaultValues: {},
	});

	function onSubmit(data: z.infer<typeof payNowSchema>) {
		payFees(props.amount, data.paymentReceipt)
			.then(() => {
				setOpen(false);
				form.reset();
				props.onPaid?.();
			})
			.catch((error) => {
				console.error(error);
				toast.error(error.message || "Failed to pay fees");
			});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				className="col-start-3 row-start-1 row-span-full my-auto"
				asChild
			>
				<Button className="text-base" disabled={props.amount === 0}>
					Pay Now
				</Button>
			</DialogTrigger>
			<DialogContent className="">
				<DialogHeader>
					<DialogTitle>Pay Now</DialogTitle>
					<DialogDescription className="max-w-[50ch] text-pretty">
						This action is <b>irreversible</b>. Double check the details before
						proceeding.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormItem>
							<Label>Amount</Label>
							<div className="text-lg -mt-1">
								{CurrencyFormatter.format(props.amount)}
							</div>
						</FormItem>

						<FormField
							control={form.control}
							name="paymentReceipt"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Payment Receipt</FormLabel>
									<FormControl>
										<Input
											type="file"
											onChange={(e) => field.onChange(e.target.files?.[0])}
											accept={ACCEPTED_TYPES.join(",")}
										/>
									</FormControl>
									<FormDescription>
										You can upload a scanned copy or a clear photo of the
										payment slip.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex gap-x-2">
							<Button
								variant="destructive"
								onClick={() => setOpen(false)}
								className="ml-auto"
								type="button"
							>
								Close
							</Button>

							<Button className="" disabled={props.amount === 0}>
								Submit Payment
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
