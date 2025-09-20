import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	getAllCoordinators,
	updateCoordinator,
} from "@/services/coordinatorsService";
import {
	type DistrictOrganizer,
	getDistrictOrganizers,
} from "@/services/userService";
import type { Coordinator } from "@/types/types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Pen } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Coordinators() {
	const [editing, setEditing] = useState<Coordinator | null>(null);
	const [coordinators, setCoordinators] = useState<Array<Coordinator>>([]);
	const [districtOrganizers, setDistrictOrganizers] = useState<
		Array<DistrictOrganizer>
	>([]);

	const fetchCoordinators = async () => {
		try {
			const cc = await getAllCoordinators();
			setCoordinators(cc);
		} catch (error) {
			console.error("Error fetching coordinators:", error);
			return [];
		} finally {
			// setLoading(false);
		}
	};
	useEffect(() => {
		getDistrictOrganizers()
			.then((data) => {
				setDistrictOrganizers(data);
			})
			.catch((err) => {
				toast.error(
					err instanceof Error
						? err.message
						: "Failed to fetch district organizers",
				);
			});
	}, []);

	useEffect(() => {
		fetchCoordinators();
	}, []);

	return (
		<>
			<Breadcrumb pageName="Coordinators" />
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Contact</TableHead>
						<TableHead>Paid Student Registrations</TableHead>
						<TableHead>Pending Student Registrations</TableHead>
						<TableHead>Associated User</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{coordinators.map((coord) => (
						<TableRow key={coord.id}>
							<TableCell>{coord.id}</TableCell>
							<TableCell>{coord.name}</TableCell>
							<TableCell>{coord.contact}</TableCell>
							<TableCell>{coord.paid_student_registrations || "-"}</TableCell>
							<TableCell>
								{coord.pending_student_registrations || "-"}
							</TableCell>
							<TableCell>
								{districtOrganizers.find(
									(u) => u.id === coord.associated_user_id,
								)?.username || "-"}
							</TableCell>
							<TableCell className="text-right">
								<Button
									size="sm"
									variant="outline"
									onClick={() => setEditing(coord)}
								>
									<Pen className="size-4" />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{editing && (
				<EditDialog
					onSave={fetchCoordinators}
					coordinator={editing}
					users={districtOrganizers}
					onClose={() => setEditing(null)}
				/>
			)}
		</>
	);
}

function EditDialog({
	coordinator,
	users,
	onClose,
	onSave,
}: {
	coordinator: Coordinator;
	users: Array<DistrictOrganizer>;
	onClose: () => void;
	onSave: () => void;
}) {
	const [form, setForm] = useState({ ...coordinator });

	const save = () => {
		if (!form.id) return;

		updateCoordinator(form.id, form.name, form.associated_user_id ?? null)
			.then(() => {
				toast.success("Coordinator updated successfully");
				onClose();
				onSave();
			})
			.catch((err) => {
				toast.error(
					err instanceof Error ? err.message : "Failed to update coordinator",
				);
			});
	};

	const handleChange = (field: string, value: string | number | undefined) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<Dialog open={!!coordinator} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Coordinator</DialogTitle>
					<DialogDescription>
						You are editing the details of {coordinator.name}.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<Label className="mb-1">Associated User</Label>
						<Select
							value={
								form.associated_user_id
									? form.associated_user_id.toString()
									: "undefined"
							}
							onValueChange={(v) =>
								handleChange(
									"associated_user_id",
									v === "undefined" ? undefined : Number.parseInt(v),
								)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a user" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="undefined">None</SelectItem>
								{users.map((u) => (
									<SelectItem key={u.id} value={u.id.toString()}>
										{u.id} - {u.username}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={save}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
