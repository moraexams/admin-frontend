import { ROLE_TECH_COORDINATOR } from "@/common/roles";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import DeleteUser from "@/components/user.delete";
import EditUser from "@/components/user.edit";
import { dateTimeFormatter } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Pen, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import UsersTable from "../components/Tables/UsersTable";
import { getUsers } from "../services/userService";
import type { User } from "../types/types";

const Users = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);
	const [page, setPage] = useState<number>(1);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [action, setAction] = useState<"edit" | "delete" | null>(null);

	const columns: Array<ColumnDef<User>> = [
		{
			accessorKey: "id",
			header: "ID",
		},
		{
			accessorKey: "username",
			header: "Username",
		},
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			header: "Created At",
			accessorFn: (row) => dateTimeFormatter.format(new Date(row.created_at)),
		},
		{
			header: "Approved",
			accessorFn: (row) => (row.approved ? "Yes" : "No"),
		},
		{
			header: "Role",
			accessorKey: "role",
		},
		{
			header: "Actions",
			cell: ({ row }) => {
				if (row.original.role === ROLE_TECH_COORDINATOR) {
					return <div className="text-muted-foreground">N/A</div>;
				}
				return (
					<div className="flex gap-2">
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

	const fetchUsers = useCallback(async () => {
		try {
			const data = await getUsers(page, itemsPerPage);
			setUsers(data.users);
			setTotalCount(data.count);
		} catch (error) {
			if (typeof error === "string") {
				setError(error);
			} else {
				setError("Failed to fetch users");
			}
		} finally {
			setLoading(false);
		}
	}, [page, itemsPerPage]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	if (error) {
		return (
			<div className="dark:bg-boxdark-2 dark:text-bodydark h-screen px-5 py-5">
				<h1 className="text-3xl font-bold mb-4">{error}</h1>
				<NavLink className="text-xl hover:underline" to="/">
					Go home
				</NavLink>
			</div>
		);
	}

	return (
		<>
			<Breadcrumb pageName="Users" />

			<EditUser
				isOpen={action === "edit" && selectedUser !== null}
				selectedUser={selectedUser}
				onFinished={fetchUsers}
				onClose={() => setSelectedUser(null)}
			/>
			<DeleteUser
				isOpen={action === "delete" && selectedUser !== null}
				selectedUser={selectedUser}
				onFinished={fetchUsers}
				onClose={() => setSelectedUser(null)}
			/>

			<div>
				<DataTable columns={columns} data={users} />
			</div>

			<div className="mb-5.5 flex justify-between">
				<Select
					name="selectDoctor"
					defaultValue={itemsPerPage.toString()}
					onValueChange={(v) => {
						setPage(1);
						setItemsPerPage(Number.parseInt(v));
					}}
				>
					<SelectTrigger className="w-fit text-base">
						<SelectValue placeholder="Count" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="5">5</SelectItem>
						<SelectItem value="10">10</SelectItem>
						<SelectItem value="100">100</SelectItem>
						<SelectItem value="500">500</SelectItem>
					</SelectContent>
				</Select>

				<ReactPaginate
					breakLabel="..."
					nextLabel=">"
					onPageChange={(event: { selected: number }) => {
						setPage(event.selected + 1);
					}}
					pageRangeDisplayed={1}
					forcePage={page - 1}
					pageCount={Math.ceil(totalCount / itemsPerPage)}
					previousLabel="<"
					renderOnZeroPageCount={null}
					containerClassName={
						"isolate inline-flex -space-x-px rounded-md shadow-xs"
					}
					pageLinkClassName={
						"relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-secondary  focus:z-20 focus:outline-offset-0"
					}
					breakLinkClassName={
						"relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-secondary hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					}
					activeLinkClassName={
						"z-10 bg-secondary text-white focus:z-20 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
					}
					previousLinkClassName={
						"relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-secondary hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					}
					nextLinkClassName={
						"relative inline-flex items-center rounded-r-md px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-secondary hover:bg-gray-400"
					}
					disabledLinkClassName={"text-black-100"}
				/>
			</div>
			<div className="flex flex-col gap-10">
				{loading ? (
					<div>Loading...</div>
				) : (
					<UsersTable
						page={page}
						itemsPerPage={itemsPerPage}
						refetch={fetchUsers}
						total={totalCount}
						userData={users}
					/>
				)}
			</div>
		</>
	);
};

export default Users;
