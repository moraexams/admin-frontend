import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { rateLimitBus } from "@/lib/rateLimitBus";
import { useEffect, useState } from "react";

export default function RateLimitDialog() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const unsubscribe = rateLimitBus.subscribe(() => setOpen(true));
		return unsubscribe;
	}, []);

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Too Many Requests</AlertDialogTitle>
					<AlertDialogDescription>
						You're making too many requests right now. Please wait around 10
						minutes before resuming your work.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction onClick={() => setOpen(false)}>
						OK
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}