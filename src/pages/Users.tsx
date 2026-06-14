import { ROLE_TECH_COORDINATOR } from "@/common/roles";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import DeleteUser from "@/components/user.delete";
import EditUser from "@/components/user.edit";
import { dateTimeFormatter } from "@/lib/utils";
import { createTimer } from "@/services/utils";
import {
	type ColumnDef,
	type RowSelectionState,
	type SortingState,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Pen, RotateCcwKey, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import {
	approveUser,
	getUsers,
	requestPasswordReset,
	setUserApproval,
} from "../services/userService";
import type { User } from "../types/types";

const Users = () => {

		const [users, setUsers] = useState<User[]>([]);
		const [selectedUser, setSelectedUser] = useState<User | null>(null);
		const [action, setAction] = useState<"edit" | "delete" | null>(null);
		const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
		const [bulkLoading, setBulkLoading] = useState(false);

		const columns: Array<ColumnDef<User>> = [
			{
				id: "select",
				header: ({ table }) => (
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && "indeterminate")
						}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
						aria-label="Select all"
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Select row"
						disabled={row.original.role === ROLE_TECH_COORDINATOR}
					/>
				),
				enableSorting: false,
			},
			{
				accessorKey: "id",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0"
				>
					Id
				</Button>
			),
		},
		{
			accessorKey: "username",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0"
				>
					Username
				</Button>
			),
		},
		{
			accessorKey: "name",
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Name
				</Button>
			),
		},
		{
			accessorFn: (row) => dateTimeFormatter.format(new Date(row.created_at)),
			id: "created_at",
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Created At
				</Button>
			),
		},
		{
			id: "approved",
			accessorFn: (row) => (row.approved ? "Yes" : "No"),
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" px-0"
				>
					Approved
				</Button>
			),
		},
		{
			accessorKey: "role",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" px-0"
				>
					Role
				</Button>
			),
		},
		{
			header: "Actions",
			cell: ({ row }) => {
				if (row.original.role === ROLE_TECH_COORDINATOR) {
					return <div className="text-muted-foreground mt-3 h-6">N/A</div>;
				}
				return (
					<div className="flex gap-2">
						<Button
							size="icon"
							variant="outline"
							disabled={!row.original.id}
							onClick={() => {
								if (!row.original.id || !row.original.username) {
									toast.error("User has no username");
									return;
								}
								toast.loading(
									`Generating password reset link for "${row.original.username}"`,
								);
								Promise.allSettled([
									requestPasswordReset(row.original.id),
									createTimer(),
								]).then((data) => {
									if (data[0].status === "rejected") {
										if (typeof data[0].reason === "string") {
											toast.error(data[0].reason);
											return;
										}
										toast.error("Failed to generate reset link");
										return;
									}
									const resetId = data[0].value?.reset_id;
									if (!resetId) {
										toast.error(
											"Failed to generate reset link: missing reset ID.",
										);
										toast.dismiss();
										return;
									}
									const link = `${window.location.origin}/reset-password?reset_id=${encodeURIComponent(resetId)}`;
									navigator.clipboard.writeText(link);
									toast.dismiss();
									toast.success("Reset link copied.");
								});
							}}
						>
							<RotateCcwKey />
						</Button>
						<Button
							size="icon"
							variant="outline"
							onClick={() => {
								setSelectedUser(row.original);
								setAction("edit");
							}}
						>
							<Pen />
						</Button>
						<Button
							size="icon"
							variant="destructive"
							onClick={() => {
								setSelectedUser(row.original);
								setAction("delete");
							}}
						>
							<Trash />
						</Button>
					</div>
				);
			},
		},
	];
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [pageCount, setPageCount] = useState<number>(-1); // total pages
	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		data: users,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		pageCount,
		state: {
			sorting,
			pagination,
			rowSelection,
		},
		manualPagination: true,
		onPaginationChange: setPagination,
		onRowSelectionChange: setRowSelection,
		enableRowSelection: (row) => row.original.role !== ROLE_TECH_COORDINATOR,
	});

	const fetchUsers = useCallback(async () => {
		const tableState = table.getState();
		const page = tableState.pagination.pageIndex + 1;
		const itemsPerPage = tableState.pagination.pageSize;
		toast.loading("Fetching users...");
		try {
			const data = await getUsers(page, itemsPerPage);
			setUsers(data.users);
			setPageCount(Math.ceil(data.count / itemsPerPage));
			toast.dismiss();
		} catch (error) {
			toast.dismiss();
			if (typeof error === "string") {
				toast.error(error);
			} else {
				toast.error("Failed to fetch users");
			}
		}
	}, [table]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers, pagination]);


	const selectedUsers = table
		.getSelectedRowModel()
		.rows.map((row) => row.original);

	const handleBulkApproval = async (approve: boolean) => {
		if (selectedUsers.length === 0) {
			toast.error("No users selected");
			return;
		}
		setBulkLoading(true);
		try {
			await Promise.all(
				selectedUsers.map((user) =>
					approve
						? approveUser(user.id as number)
						: setUserApproval(user, false),
				),
			);
			toast.success(
				approve
					? "Selected users approved"
					: "Selected users disapproved",
			);
			setRowSelection({});
			await fetchUsers();
		} catch (error) {
			toast.error(
				typeof error === "string" ? error : "Bulk update failed",
			);
		} finally {
			setBulkLoading(false);
		}
	};

	return (
		<>
			<Breadcrumb pageName="Users" />
			<div className="flex gap-2 mb-4">
				<Button
					size="sm"
					disabled={bulkLoading || selectedUsers.length === 0}
					onClick={() => handleBulkApproval(true)}
				>
					Approve Selected
				</Button>
				<Button
					size="sm"
					variant="destructive"
					disabled={bulkLoading || selectedUsers.length === 0}
					onClick={() => handleBulkApproval(false)}
				>
					Disapprove Selected
				</Button>
			</div>
			<EditUser
				isOpen={action === "edit" && selectedUser !== null}
				selectedUser={selectedUser}
				onFinished={fetchUsers}
				onClose={() => {
					setAction(null);
					setSelectedUser(null);
				}}
			/>
			<DeleteUser
				isOpen={action === "delete" && selectedUser !== null}
				selectedUser={selectedUser}
				onFinished={fetchUsers}
				onClose={() => {
					setAction(null);
					setSelectedUser(null);
				}}
			/>
			<DataTable table={table} />
		</>
	);
};

export default Users;
