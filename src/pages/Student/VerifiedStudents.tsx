import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { dateTimeFormatter } from "@/lib/utils";
import { getVerifiedStudents } from "@/services/studentService";
import { createTimer } from "@/services/utils";
import type { Student } from "@/types/types";
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
	const [verifiedStudents, setVerifiedStudents] = useState<Array<Student>>([]);
	const [selectedVerifiedStudent, setSelectedVerifiedStudent] =
		useState<Student | null>(null);
	const [action, setAction] = useState<"edit" | "delete" | "view" | null>(null);

	const columns: Array<ColumnDef<Student>> = [
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
		// {
		// 	accessorKey: "rank_district",
		// 	header: ({ column }) => (
		// 		<Button
		// 			className="px-0"
		// 			variant="ghost"
		// 			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
		// 		>
		// 			Rank District
		// 		</Button>
		// 	),
		// },
		// {
		// 	accessorKey: "exam_district",
		// 	header: ({ column }) => (
		// 		<Button
		// 			className="px-0"
		// 			variant="ghost"
		// 			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
		// 		>
		// 			Exam District
		// 		</Button>
		// 	),
		// },
		// {
		// 	accessorKey: "exam_centre",
		// 	header: ({ column }) => (
		// 		<Button
		// 			className="px-0"
		// 			variant="ghost"
		// 			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
		// 		>
		// 			Exam Centre
		// 		</Button>
		// 	),
		// },
		{
			id: "created_at",
			accessorFn: (row) => {
				return dateTimeFormatter.format(new Date(row.checked_at));
			},
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" px-0"
				>
					Verified At
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
		onPaginationChange: setPagination,
	});

	const fetchVerifiedStudents = useCallback(async () => {
		const tableState = table.getState();
		const page = tableState.pagination.pageIndex + 1;
		const itemsPerPage = tableState.pagination.pageSize;
		toast.loading("Loading...");

		return Promise.allSettled([
			getVerifiedStudents(page, itemsPerPage),
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
	}, [table]);

	useEffect(() => {
		fetchVerifiedStudents();
	}, [fetchVerifiedStudents, pagination]);

	return (
		<>
			<Breadcrumb pageName="Verified Students" />
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
