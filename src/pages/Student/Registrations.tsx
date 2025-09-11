import { ROLE_TECH_COORDINATOR } from "@/common/roles";
import PageTitle from "@/components/PageTitle";
import DeleteTempStudent from "@/components/temp-student.delete";
import ResetTempStudent from "@/components/temp-student.reset-status";
import ViewTempStudent from "@/components/temp-student.view";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { cn, dateTimeFormatter } from "@/lib/utils";
import { LOCAL_STORAGE__ROLE } from "@/services/authServices";
import { getUnverifiedStudents } from "@/services/studentService";
import { createTimer } from "@/services/utils";
import type { TemporaryStudent } from "@/types/manual-admissions";
import {
	type ColumnDef,
	type SortingState,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Eye, RotateCcw, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

export default function StudentRegistrations() {
	const [unverifiedStudents, setUnverifiedStudents] = useState<
		TemporaryStudent[]
	>([]);
	const [selectedUnverifiedStudent, setSelectedUnverifiedStudent] =
		useState<TemporaryStudent | null>(null);
	const [action, setAction] = useState<
		"edit" | "delete" | "view" | "reset_status" | null
	>(null);

	const role = localStorage.getItem(LOCAL_STORAGE__ROLE);
	const columns: Array<ColumnDef<TemporaryStudent>> = [
		{
			id: "-",
			cell: ({ row }) => (
				<>
					<div
						className={cn(
							"w-3 h-8",
							row.original.checked_by ? "bg-green-500" : "hidden",
						)}
					/>
					<div
						className={cn(
							"w-3 h-8",
							row.original.rejected_by ? "bg-red-500" : "hidden",
						)}
					/>
				</>
			),
		},
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
				return dateTimeFormatter.format(new Date(row.created_at));
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
		{
			header: "Actions",
			cell: ({ row }) => {
				return (
					<div className="flex gap-2">
						<Button
							size="icon_sm"
							onClick={() => {
								setSelectedUnverifiedStudent(row.original);
								setAction("view");
							}}
						>
							<Eye />
						</Button>
						{/* <Button
							size="icon"
							variant="outline"
							onClick={() => {
								setSelectedUnverifiedStudent(row.original);
								setAction("edit");
							}}
						>
							<Pen />
						</Button> */}
						{role === ROLE_TECH_COORDINATOR ? (
							<>
								<Button
									size="icon_sm"
									disabled={
										row.original.checked_by === null &&
										row.original.rejected_by === null
									}
									onClick={() => {
										setSelectedUnverifiedStudent(row.original);
										setAction("reset_status");
									}}
								>
									<RotateCcw className="size-4" />
								</Button>
								<Button
									size="icon_sm"
									variant="destructive"
									onClick={() => {
										setSelectedUnverifiedStudent(row.original);
										setAction("delete");
									}}
								>
									<Trash className="size-4" />
								</Button>
							</>
						) : null}
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
		data: unverifiedStudents,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		pageCount,
		state: {
			sorting,
			pagination,
		},
		manualPagination: true,
		manualSorting: true,
		onPaginationChange: setPagination,
	});

	const fetchUnverifiedStudents = useCallback(async () => {
		toast.loading("Loading...");
		const tableState = table.getState();
		const page = tableState.pagination.pageIndex + 1;
		const itemsPerPage = tableState.pagination.pageSize;
		const sortParam = tableState.sorting[0]
			? `&sort=${tableState.sorting[0].desc ? "-" : ""}${tableState.sorting[0].id}`
			: "";

		return Promise.allSettled([
			getUnverifiedStudents(page, itemsPerPage, sortParam),
			createTimer(500),
		])
			.then((hu) => {
				if (hu[0].status === "rejected") {
					throw hu[0].reason;
				}
				setUnverifiedStudents(hu[0].value.unverified_students);
				setPageCount(Math.ceil(hu[0].value.count / itemsPerPage));
			})
			.catch((error) => {
				if (typeof error === "string") {
					toast.error(error);
				} else {
					toast.error("Failed to fetch unverified students");
				}
			})
			.finally(() => {
				toast.dismiss();
			});
	}, [table]);

	useEffect(() => {
		fetchUnverifiedStudents();
	}, [fetchUnverifiedStudents, pagination, sorting]);

	return (
		<>
			<Breadcrumb pageName="Student Registrations" />
			<p className="mb-4 max-w-prose">
				In the below table, you can view and manage student registration
				records.
			</p>
			<p className="mb-4 max-w-prose">
				The table shows verified students as well, with a{" "}
				<span className="text-green-500 font-bold">green</span> box and rejected
				students with a <span className="text-red-500 font-bold">red</span> box.
			</p>
			<PageTitle title="Student Registrations | Mora Exams" />
			<DataTable table={table} />
			<ViewTempStudent
				isOpen={action === "view" && selectedUnverifiedStudent !== null}
				selectedTempStudent={selectedUnverifiedStudent}
				onFinished={fetchUnverifiedStudents}
				onClose={() => {
					setAction(null);
					setSelectedUnverifiedStudent(null);
				}}
			/>
			<DeleteTempStudent
				isOpen={action === "delete" && selectedUnverifiedStudent !== null}
				selectedTempStudent={selectedUnverifiedStudent}
				onFinished={fetchUnverifiedStudents}
				onClose={() => {
					setAction(null);
					setSelectedUnverifiedStudent(null);
				}}
			/>
			<ResetTempStudent
				isOpen={action === "reset_status" && selectedUnverifiedStudent !== null}
				selectedTempStudent={selectedUnverifiedStudent}
				onFinished={fetchUnverifiedStudents}
				onClose={() => {
					setAction(null);
					setSelectedUnverifiedStudent(null);
				}}
			/>
		</>
	);
}
