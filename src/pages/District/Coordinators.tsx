import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui/button";
import { addCoordinator } from "@/services/coordinatorsService";
import { getDistrictsWithCentres } from "@/services/districtService";
import { Input } from "@/components/ui/input";

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
	assignCentresToCoordinator,
	deleteCoordinator,
	getAllCoordinators,
	getCoordinatorCentres,
	updateCoordinator,
} from "@/services/coordinatorsService";
import {
	type DistrictOrganizer,
	getDistrictOrganizers,
} from "@/services/userService";
import type { Coordinator } from "@/types/types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { MapPin, Pen } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Coordinators() {
	const [editing, setEditing] = useState<Coordinator | null>(null);
	const [adding, setAdding] = useState(false);
	const [assigning, setAssigning] = useState<Coordinator | null>(null);
	const [districts, setDistricts] = useState<Array<{id: number; name: string; exam_centres?: Array<{id: number; name: string}>}>>([]);
	const [coordinators, setCoordinators] = useState<Array<Coordinator>>([]);
	const [districtOrganizers, setDistrictOrganizers] = useState<
		Array<DistrictOrganizer>
	>([]);

	const fetchCoordinators = async () => {
		try {
			const cc = await getAllCoordinators();
			setCoordinators(cc ?? []);
		} catch (error) {
			console.error("Error fetching coordinators:", error);
			return [];
		} finally {
			// setLoading(false);
		}
	};

	useEffect(() => {
	    getDistrictsWithCentres().then((data: any) => {
	        const list = Array.isArray(data) ? data : data?.districts ?? [];
	        setDistricts(list);
	    });
	}, []);

	useEffect(() => {
		getDistrictOrganizers()
			.then((data) => {
				setDistrictOrganizers(data ?? []);
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
			<div className="flex justify-end mb-4">
				<Button onClick={() => setAdding(true)}>Add Coordinator</Button>
			</div>
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
							<TableCell className="text-right space-x-2">
								<Button
									size="sm"
									variant="outline"
									onClick={() => setEditing(coord)}
								>
									<Pen className="size-4" />
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => setAssigning(coord)}
								>
									<MapPin className="size-4" />
								</Button>
						</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{adding && (
				<AddDialog
					onSave={fetchCoordinators}
					users={districtOrganizers}
					districts={districts}
					onClose={() => setAdding(false)}
				/>
			)}

			{assigning && (
				<AssignCentresDialog
					coordinator={assigning}
					districts={districts}
					onClose={() => setAssigning(null)}
				/>
			)}

			{editing && (
				<EditDialog
					onSave={fetchCoordinators}
					coordinator={editing}
					users={districtOrganizers}
					districts={districts}
					onClose={() => setEditing(null)}
				/>
			)}
		</>
	);
}

function EditDialog({
  coordinator,
  users,
  districts,
  onClose,
  onSave,
}: {
  coordinator: Coordinator;
  users: Array<DistrictOrganizer>;
  districts: Array<{ id: number; name: string; exam_centres?: Array<{ id: number; name: string }> }>;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({ ...coordinator });
  const [districtIds, setDistrictIds] = useState<number[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!coordinator.id) return;
    getCoordinatorCentres(coordinator.id)
      .then((centreIds) => {
        const assigned = districts
          .filter((d) =>
            (d.exam_centres ?? []).some((ec) =>
              centreIds.map(Number).includes(Number(ec.id)),
            ),
          )
          .map((d) => d.id);
        setDistrictIds(assigned);
      })
      .catch((err) => {
        toast.error(
          typeof err === "string" ? err : "Failed to fetch assigned districts",
        );
      })
      .finally(() => setLoadingDistricts(false));
  }, [coordinator.id, districts]);

  const toggleDistrict = (id: number) => {
    setDistrictIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const save = () => {
    if (!form.id) return;

    updateCoordinator(
      form.id,
      form.name,
      form.associated_user_id ?? null,
      form.contact,
    )
      .then(() => {
        const centreIds = districts
          .filter((d) => districtIds.includes(d.id))
          .flatMap((d) => (d.exam_centres ?? []).map((ec) => ec.id));
        return assignCentresToCoordinator(form.id as number, centreIds);
      })
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

  const handleDelete = () => {
    if (!form.id) return;
    const confirmed = window.confirm(
      `Delete ${form.name}? This permanently removes the coordinator, their contact numbers, and centre assignments. This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    deleteCoordinator(form.id)
      .then(() => {
        toast.success("Coordinator deleted successfully");
        onClose();
        onSave();
      })
      .catch((err) => {
        toast.error(
          typeof err === "string" ? err : "Failed to delete coordinator",
        );
      })
      .finally(() => setDeleting(false));
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
            <Label className="mb-1">Name</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1">Contact</Label>
            <Input
              value={form.contact ?? ""}
              onChange={(e) => handleChange("contact", e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <Label className="mb-1">Districts</Label>
            {loadingDistricts ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              <div className="border rounded-md p-2 space-y-1 max-h-40 overflow-y-auto">
                {(districts ?? []).map((d) => (
                  <label key={d.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={districtIds.includes(d.id)}
                      onChange={() => toggleDistrict(d.id)}
                    />
                    {d.name}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div>
            <Label className="mb-1">Paid Student Registrations</Label>
            <Input
              type="number"
              value={form.paid_student_registrations ?? 0}
              disabled
              onChange={(e) =>
                handleChange("paid_student_registrations", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label className="mb-1">Pending Student Registrations</Label>
            <Input
              type="number"
              value={form.pending_student_registrations ?? 0}
              disabled
              onChange={(e) =>
                handleChange("pending_student_registrations", Number(e.target.value))
              }
            />
          </div>
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
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddDialog({ users, districts, onClose, onSave }: { users: Array<DistrictOrganizer>; districts: Array<{id: number; name: string; exam_centres?: Array<{id: number; name: string}>}>; onClose: () => void; onSave: () => void }) {
    const [form, setForm] = useState({
		name: "", telephone_no: "",
		district_ids: [] as number[],
		associated_user_id: undefined as number | undefined,
	});

    const save = () => {
		if (!form.name || form.district_ids.length === 0) return;
		addCoordinator(form.name, form.district_ids[0], form.telephone_no, form.associated_user_id)
			.then((data: any) => {
				console.log("Add response:", data); 
				const coordinatorId = data?.data?.id;
				console.log("Coordinator ID:", coordinatorId); // ← add
    console.log("Districts:", form.district_ids);  // ← add
    console.log("All districts:", districts); 
				if (coordinatorId) {
					const centreIds = districts
						.filter(d => form.district_ids.includes(d.id))
						.flatMap(d => (d.exam_centres ?? []).map(ec => ec.id));
					
					console.log("Centre IDs:", centreIds); // ← add
					return assignCentresToCoordinator(coordinatorId, centreIds);
				}
			})
			.then(() => { toast.success("Coordinator added successfully"); onClose(); onSave(); })
			.catch((err) => { toast.error(err); });
	};

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Coordinator</DialogTitle>
                    <DialogDescription>Fill in the details to add a new coordinator.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label className="mb-1">Name</Label>
                        <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                        <Label className="mb-1">Telephone No.</Label>
                        <Input value={form.telephone_no} onChange={(e) => setForm((p) => ({ ...p, telephone_no: e.target.value }))} />
                    </div>
                    <div>
						<Label className="mb-1">Districts</Label>
						<div className="border rounded-md p-2 space-y-1 max-h-40 overflow-y-auto">
							{(districts ?? []).map((d) => (
								<label key={d.id} className="flex items-center gap-2 text-sm">
									<input
										type="checkbox"
										checked={form.district_ids.includes(d.id)}
										onChange={(e) => setForm((p) => ({
											...p,
											district_ids: e.target.checked
												? [...p.district_ids, d.id]
												: p.district_ids.filter((id) => id !== d.id)
										}))}
									/>
									{d.name}
								</label>
							))}
						</div>
					</div>
                    <div>
                        <Label className="mb-1">Associated User</Label>
                        <Select value={form.associated_user_id ? form.associated_user_id.toString() : "undefined"} onValueChange={(v) => setForm((p) => ({ ...p, associated_user_id: v === "undefined" ? undefined : Number.parseInt(v) }))}>
                            <SelectTrigger><SelectValue placeholder="Select a user" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="undefined">None</SelectItem>
                                {(users ?? []).map((u) => (<SelectItem key={u.id} value={u.id.toString()}>{u.id} - {u.username}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={save}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AssignCentresDialog({
	coordinator,
	districts,
	onClose,
}: {
	coordinator: Coordinator;
	districts: Array<{ id: number; name: string; exam_centres?: Array<{ id: number; name: string }> }>;
	onClose: () => void;
}) {
	const [selected, setSelected] = useState<Set<number>>(new Set());
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [assignedDistrictIds, setAssignedDistrictIds] = useState<Set<number>>(new Set());

	useEffect(() => {
		if (!coordinator.id) return;
		getCoordinatorCentres(coordinator.id)
			.then((ids) => {
				setSelected(new Set(ids.map(Number)));
				const districtIds = new Set(
					districts
						.filter(d => (d.exam_centres ?? []).some(ec => ids.map(Number).includes(Number(ec.id))))
						.map(d => d.id)
				);
				setAssignedDistrictIds(districtIds);
			})
			.catch((err) => {
				toast.error(
					typeof err === "string" ? err : "Failed to fetch assigned centres",
				);
			})
			.finally(() => setLoading(false));
	}, [coordinator.id]);

	const toggle = (centreId: number) => {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(centreId)) {
				next.delete(centreId);
			} else {
				next.add(centreId);
			}
			return next;
		});
	};

	const save = () => {
		if (!coordinator.id) return;
		setSaving(true);
		assignCentresToCoordinator(coordinator.id, Array.from(selected))
			.then(() => {
				toast.success("Centres assigned successfully");
				onClose();
			})
			.catch((err) => {
				toast.error(
					typeof err === "string" ? err : "Failed to assign centres",
				);
			})
			.finally(() => setSaving(false));
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Assign Exam Centres</DialogTitle>
					<DialogDescription>
						Select the exam centres {coordinator.name} can register students for.
					</DialogDescription>
				</DialogHeader>
				{loading ? (
					<div className="py-4 text-center text-sm text-muted-foreground">
						Loading...
					</div>
				) : (
					<div className="space-y-4">
						{districts.filter(d => assignedDistrictIds.has(d.id)).map((d) => (
							<div key={d.id}>
								<h4 className="font-semibold mb-2">{d.name}</h4>
								<div className="space-y-1 pl-2">
									{(d.exam_centres ?? []).map((centre) => (
										<label
											key={centre.id}
											className="flex items-center gap-2 text-sm"
										>
											<input
												type="checkbox"
												checked={selected.has(centre.id)}
												onChange={() => toggle(centre.id)}
											/>
											{centre.name}
										</label>
									))}
								</div>
							</div>
						))}
					</div>
				)}
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={save} disabled={loading || saving}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}