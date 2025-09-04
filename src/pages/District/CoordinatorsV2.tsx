import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pen } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import type { Coordinator } from "@/types/types"
import { getAllCoordinators } from "@/services/coordinatorsService"
import { getDistrictOrganizers, type DistrictOrganizer } from "@/services/userService"
import toast from "react-hot-toast"

export default function Coordinators() {
  const [editing, setEditing] = useState(null)
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


  const handleSave = (updated) => {
    setCoordinators((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    setEditing(null)
  }

  return (
    <>
    <Breadcrumb pageName="Coordinators" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
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
              <TableCell>{districtOrganizers.find((u) => u.id === coord.associated_user_id)?.username || "-"}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" onClick={() => setEditing(coord)}>
                  <Pen className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editing && (
        <EditDialog
          coordinator={editing}
          users={districtOrganizers}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  )
}

function EditDialog({ coordinator, users, onSave, onClose }: 
  {
  coordinator: Coordinator,
  users: Array<DistrictOrganizer>,
  onSave: (updated: Coordinator) => void,
  onClose: () => void
}
) {
  const [form, setForm] = useState({ ...coordinator })

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={!!coordinator} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Coordinator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          </div>
          <div>
            <Label>Associated User</Label>
            <Select value={form.userId} onValueChange={(v) => handleChange("userId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
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
          <Button onClick={() => onSave(form)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
