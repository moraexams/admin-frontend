import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
	type CentreWiseTempStudentCount,
	getCentreWiseTempStudentCounts,
} from "@/services/statsServices";
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

export default function StudentRegistrationsCountDistrictWise() {
	const [districts, setDistricts] = useState<Array<CentreWiseTempStudentCount>>(
		[],
	);

	const columns: Array<ColumnDef<CentreWiseTempStudentCount>> = [
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
			accessorKey: "name",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0"
				>
					Name
				</Button>
			),
		},
		{
			accessorKey: "count_total",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">
					{row.original.count_total}
				</div>
			),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Count
				</Button>
			),
		},
		{
			accessorKey: "count_male",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">
					{row.original.count_male}
				</div>
			),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Male
				</Button>
			),
		},
		{
			accessorKey: "count_female",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">
					{row.original.count_female}
				</div>
			),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Female
				</Button>
			),
		},
		{
			accessorKey: "count_tamil",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">
					{row.original.count_tamil}
				</div>
			),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Tamil
				</Button>
			),
		},
		{
			accessorKey: "count_english",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">
					{row.original.count_english}
				</div>
			),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					English
				</Button>
			),
		},
		{
			accessorKey: "count_online",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">
					{row.original.count_online}
				</div>
			),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Online
				</Button>
			),
		},
		{
			accessorKey: "count_through_coordinators",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">
					{row.original.count_through_coordinators}
				</div>
			),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Through Coordinators
				</Button>
			),
		},
	];
	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		data: districts,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	const fetchStats = useCallback(async () => {
		toast.loading("Loading...");
		try {
			const data = await getCentreWiseTempStudentCounts();
			setDistricts(data.centres);
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
		fetchStats();
	}, [fetchStats]);

	return (
		<>
			<PageTitle title="Student Registrations (Centre Wise) | Mora Exams" />
			<Breadcrumb pageName="Centre-Wise Student Registrations" />

			<DataTable table={table} />
		</>
	);
}
