import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
	type DistrictWiseTempStudentCount,
	getDistrictWiseTempStudentCounts,
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
	const [districts, setDistricts] = useState<DistrictWiseTempStudentCount[]>(
		[],
	);

	const columns: Array<ColumnDef<DistrictWiseTempStudentCount>> = [
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
			accessorKey: "student_count",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">
					{row.original.student_count}
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
			const data = await getDistrictWiseTempStudentCounts();
			console.log(data);
			setDistricts(data.districts);
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
			<PageTitle title="Student Registrations (District Wise) | Mora Exams" />
			<Breadcrumb pageName="District-Wise Student Registrations" />

			<DataTable table={table} />
		</>
	);
}
