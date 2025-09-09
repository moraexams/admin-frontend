import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { dateTimeFormatter } from "@/lib/utils";
import {
	type ColumnDef,
	type SortingState,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Pen, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import type { TemporaryStudent } from "@/types/manual-admissions";
import { getUnverifiedStudents } from "@/services/studentService";
import PageTitle from "@/components/PageTitle";
import { LOCAL_STORAGE__ROLE } from "@/services/authServices";
import { ROLE_TECH_COORDINATOR } from "@/common/roles";

const UnverifiedStudents = () => {
	const [unverifiedStudents, setUnverifiedStudents] = useState<TemporaryStudent[]>([]);
	const [selectedUnverifiedStudent, setSelectedUnverifiedStudent] = useState<TemporaryStudent | null>(null);
	const [action, setAction] = useState<"edit" | "delete" | null>(null);

	const columns: Array<ColumnDef<TemporaryStudent>> = [
		{
			accessorKey: "nic",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0"
				>
					NIC
				</Button>
			),
		},
		{
			accessorKey: "full_name",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0"
				>
					Full Name
				</Button>
			),
		},
		{
			id: "email",
			accessorFn: (row) => row.email.toLowerCase(),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Email
				</Button>
			),
		},
		{
			accessorKey: "gender",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" px-0"
				>
					Gender
				</Button>
			),
		},
		{
			accessorKey: "medium",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" px-0"
				>
					Medium
				</Button>
			),
		},
		{
			accessorKey: "rank_district",
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Rank District
				</Button>
			),
		},
		{
			accessorKey: "exam_district",
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Exam District
				</Button>
			),
		},
		{
			accessorKey: "exam_centre",
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Exam Centre
				</Button>
			),
		},
		{
			id: "created_at",
			accessorFn: (row) => {
				return dateTimeFormatter.format(new Date(row.created_at))
			},
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" px-0"
				>
					Created At
				</Button>
			),
		},
	];
	
	const role = localStorage.getItem(LOCAL_STORAGE__ROLE);
	if (role === ROLE_TECH_COORDINATOR) {
		columns.push(
		{
			header: "Actions",
			cell: ({ row }) => {
				// TODO
				return null;
				return (
					<div className="flex gap-2">
						<Button
							size="icon"
							variant="outline"
							onClick={() => {
								setSelectedUnverifiedStudent(row.original);
								setAction("edit");
							}}
						>
							<Pen />
						</Button>
						<Button
							size="icon"
							variant="destructive"
							onClick={() => {
								setSelectedUnverifiedStudent(row.original);
								setAction("delete");
							}}
						>
							<Trash />
						</Button>
					</div>
				);
			},
		});
	}
	

	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		data: unverifiedStudents,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	const fetchUnverifiedStudents = useCallback(async () => {
		const tableState = table.getState();
		const page = tableState.pagination.pageIndex + 1;
		const itemsPerPage = tableState.pagination.pageSize;
		toast.loading("Fetching unverified students...");
		try {
			const data = await getUnverifiedStudents(page, itemsPerPage);
			setUnverifiedStudents(data.unverified_students);
			toast.dismiss();
		} catch (error) {
			toast.dismiss();
			if (typeof error === "string") {
				toast.error(error);
			} else {
				toast.error("Failed to fetch unverified students");
			}
		}
	}, [table]);

	useEffect(() => {
		fetchUnverifiedStudents();
	}, [fetchUnverifiedStudents]);

	return (
		<>
			<Breadcrumb pageName="Unverified Students" />
			<PageTitle title="Unverified Students | Mora Exams" />
			<DataTable table={table} />
		</>
	);
};

export default UnverifiedStudents;
