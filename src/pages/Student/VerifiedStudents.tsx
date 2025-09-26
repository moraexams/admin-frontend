import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { getVerifiedStudents } from "@/services/studentService";
import { createTimer } from "@/services/utils";
import type { VerifiedStudent } from "@/types/types";

import {
	type ColumnDef,
	type SortingState,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

export default function VerifiedStudents() {
	const [verifiedStudents, setVerifiedStudents] = useState<
		Array<VerifiedStudent>
	>([]);
	// const [selectedVerifiedStudent, setSelectedVerifiedStudent] =
	// 	useState<Student | null>(null);
	// const [action, setAction] = useState<"edit" | "delete" | "view" | null>(null);

	const columns: Array<ColumnDef<VerifiedStudent>> = [
		{
			accessorKey: "index_no",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0"
				>
					Index No.
				</Button>
			),
		},
		{
			accessorKey: "name",
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
			accessorKey: "stream",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" px-0"
				>
					Stream
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
		// {
		// 	header: "Actions",
		// 	cell: ({ row }) => {
		// 		return (
		// 			<div className="flex gap-2">
		// 				<Button
		// 					size="icon_sm"
		// 					onClick={() => {
		// 						setSelectedVerifiedStudent(row.original);
		// 						setAction("view");
		// 					}}
		// 				>
		// 					<Eye />
		// 				</Button>
		// 				{role === ROLE_TECH_COORDINATOR ? (
		// 					<Button
		// 						size="icon_sm"
		// 						variant="destructive"
		// 						onClick={() => {
		// 							setSelectedVerifiedStudent(row.original);
		// 							setAction("delete");
		// 						}}
		// 					>
		// 						<Trash className="size-4" />
		// 					</Button>
		// 				) : null}
		// 			</div>
		// 		);
		// 	},
		// },
	];
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [pageCount, setPageCount] = useState<number>(-1); // total pages

	const [sorting, setSorting] = useState<SortingState>([]);
	const [search, setSearch] = useState("");
	const table = useReactTable({
		data: verifiedStudents,
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

	const fetchVerifiedStudents = useCallback(async () => {
		const tableState = table.getState();
		const page = tableState.pagination.pageIndex + 1;
		const itemsPerPage = tableState.pagination.pageSize;
		toast.loading("Loading...");
		const searchParam = search
			? `&search=nic:${search}&search=index_no:${search}`
			: "";

		return Promise.allSettled([
			getVerifiedStudents(page, itemsPerPage, searchParam),
			createTimer(500),
		])
			.then((hu) => {
				if (hu[0].status === "rejected") {
					throw hu[0].reason;
				}
				setVerifiedStudents(hu[0].value.students);
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: it's ok
	useEffect(() => {
		fetchVerifiedStudents();
	}, [fetchVerifiedStudents, pagination, sorting, search]);

	useEffect(() => {
		const handler = setTimeout(() => {
			setSearch(searchInput);
			setPagination((prev) => ({ ...prev, pageIndex: 0 }));
		}, 500);
		return () => clearTimeout(handler);
	}, [searchInput]);

	return (
		<>
			<Breadcrumb pageName="Verified Students" />
			<div className="grid grid-cols-2 grid-rows-2 gap-x-4">
				<p className="mb-4 max-w-prose">
					In the below table, you can view and manage student registration
					records. You can search students by NIC.
				</p>

				<div className="col-start-2 row-start-1 row-span-full">
					<h2 className="text-xl font-medium mb-2">
						Search by NIC or Index No.
					</h2>
					<Input
						type="text"
						placeholder="Search..."
						className="max-w-[320px] border p-2 rounded"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
				</div>
			</div>
			<PageTitle title="Verified Students | Mora Exams" />
			<DataTable table={table} />
			{/* <ViewTempStudent
				isOpen={action === "view" && selectedVerifiedStudent !== null}
				selectedTempStudent={selectedVerifiedStudent}
				onFinished={fetchVerifiedStudents}
				onClose={() => {
					setAction(null);
					setSelectedVerifiedStudent(null);
				}}
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
