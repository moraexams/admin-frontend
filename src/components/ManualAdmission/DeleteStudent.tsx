import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteStudent } from "@/services/manualAdmissionService";
import { toast } from "react-hot-toast";
import { Label } from "../ui/label";

interface Props {
	student: {
		nic: string;
		full_name: string;
	};
	open: boolean;
	setOpen: (open: boolean) => void;
	onStudentDeleted?: () => void;
}

export default function DeleteStudent(props: Props) {
	return (
		<Dialog onOpenChange={props.setOpen} open={props.open}>
			<DialogContent className="p-3 md:p-6">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						Remove Student
					</DialogTitle>
					<DialogDescription className="max-w-prose">
						This action is <b>irreversible</b>. Are you sure you want to remove
						this student?
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div>
						<Label className="gap-0 mb-1">NIC</Label>
						<Input disabled value={props.student.nic} />
					</div>

					<div>
						<Label className="gap-0 mb-1">Full Name</Label>
						<Input disabled value={props.student.full_name} />
					</div>

					<div className="mt-4 flex justify-end space-x-3">
						<Button
							variant="outline"
							onClick={() => props.setOpen(false)}
							type="button"
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								deleteStudent(props.student.nic)
									.then(() => {
										props.setOpen(false);
										toast.success("Student deleted successfully");
										props.onStudentDeleted?.();
									})
									.catch((err) => {
										toast.error(
											typeof err === "string" ? err : "Error deleting student",
										);
									});
							}}
						>
							Confirm
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
