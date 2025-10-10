import PageTitle from "@/components/PageTitle";
import ViewRejectedTempStudent from "@/components/rejected-student.view";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { cn, dateTimeFormatter } from "@/lib/utils";
import { getRejectedStudents } from "@/services/studentService";
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
import { Eye } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

export default function RejectedStudents() {
	const [rejectedTempStudents, setRejectedTempStudents] = useState<
		Array<TemporaryStudent>
	>([]);
	const [selectedRejectedStudent, setSelectedRejectedStudent] =
		useState<TemporaryStudent | null>(null);
	const [action, setAction] = useState<"edit" | "delete" | "view" | null>(null);

	const columns: Array<ColumnDef<TemporaryStudent>> = [
		{
			id: "-",
			cell: ({ row }) => (
				<>
					<div
						className={cn(
							"w-3 h-8",
							row.original.rechecked_by ? "bg-green-500" : "hidden",
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
			id: "rejection_reason",
			cell: ({ row }) => (
				<div className="max-w-sm whitespace-normal break-words">
					{row.original.rejection_reason}
				</div>
			),
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" px-0"
				>
					Rejected Reason
				</Button>
			),
		},
		{
			accessorKey: "rejected_by",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" px-0"
				>
					Rejected By
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
			id: "rejected_at",
			accessorFn: (row) => {
				if (!row.rejected_at) {
					return "";
				}
				return dateTimeFormatter.format(new Date(row.rejected_at));
			},
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" px-0"
				>
					Rejected At
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
								setSelectedRejectedStudent(row.original);
								setAction("view");
							}}
						>
							<Eye />
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
	const [search, setSearch] = useState("");
	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		data: rejectedTempStudents,
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
		manualFiltering: true,
		onPaginationChange: setPagination,
	});

	const [searchInput, setSearchInput] = useState<string>("");

	const fetchRejectedStudents = useCallback(async () => {
		const tableState = table.getState();
		const page = tableState.pagination.pageIndex + 1;
		const itemsPerPage = tableState.pagination.pageSize;
		toast.loading("Loading...");

		const searchParam = search ? `&search=nic:${search}` : "";

		return Promise.allSettled([
			getRejectedStudents(page, itemsPerPage, searchParam),
			createTimer(),
		])
			.then((hu) => {
				if (hu[0].status === "rejected") {
					throw hu[0].reason;
				}
				setRejectedTempStudents(hu[0].value.students);
				console.log("set", hu[0].value, itemsPerPage);
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
	}, [table, search]);

	useEffect(() => {
		fetchRejectedStudents();
	}, [fetchRejectedStudents, pagination, sorting, search]);

	useEffect(() => {
		const handler = setTimeout(() => {
			setSearch(searchInput);
			setPagination((prev) => ({ ...prev, pageIndex: 0 }));
		}, 500);
		return () => clearTimeout(handler);
	}, [searchInput]);

	return (
		<>
			<Breadcrumb pageName="Rejected Students" />
			<div className="grid grid-cols-2 grid-rows-2 gap-x-4">
				<p className="mb-4 max-w-prose">
					In the below table, you can recheck the students who were rejected in
					the 1st round of checking.
				</p>
				<p className="mb-4 max-w-prose">
					Students who have been rechecked and verified are indicated with a{" "}
					<span className="text-green-500 font-bold">green</span> box.
				</p>
				<div className="col-start-2 row-start-1 row-span-full">
					<h2 className="text-xl font-medium mb-2">Search by NIC</h2>
					<Input
						type="text"
						placeholder="Search..."
						className="max-w-[320px] border p-2 rounded"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
				</div>
			</div>
			<PageTitle title="Rejected Students | Mora Exams" />
			<DataTable table={table} />
			<ViewRejectedTempStudent
				isOpen={action === "view" && selectedRejectedStudent !== null}
				selectedTempStudent={selectedRejectedStudent}
				onFinished={fetchRejectedStudents}
				onClose={() => {
					setAction(null);
					setSelectedRejectedStudent(null);
				}}
			/>
			{/* <ViewTempStudent
			/>
			<DeleteTempStudent
				isOpen={action === "delete" && selectedVerifiedStudent !== null}
				selectedTempStudent={selectedVerifiedStudent}
				onFinished={fetchVerifiedStudents}
				onClose={() => {
					setAction(null);
					setSelectedVerifiedStudent(null);
				}}
			/> */}
		</>
	);
}
