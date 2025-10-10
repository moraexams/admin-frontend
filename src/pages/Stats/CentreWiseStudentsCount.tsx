import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type CentreWiseVerifiedStudentsCount,
	getCentreWiseStudentsPerSubject,
} from "@/services/statsServices";
import { createTimer } from "@/services/utils";
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

export default function CentreWiseVerifiedStudents() {
	const [centreWiseStats, setCentreWiseStats] = useState<
		Array<CentreWiseVerifiedStudentsCount>
	>([]);
	const [selectedSubject, setSelectedSubject] = useState<number>(1);

	const columns: Array<ColumnDef<CentreWiseVerifiedStudentsCount>> = [
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
			accessorKey: "district_name",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0"
				>
					District
				</Button>
			),
		},
		{
			accessorKey: "count_total",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">{row.original.count_total}</div>
			),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Total
				</Button>
			),
		},
		{
			accessorKey: "count_tm",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">{row.original.count_tm}</div>
			),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					TM
				</Button>
			),
		},
		{
			accessorKey: "count_em",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">{row.original.count_em}</div>
			),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					EM
				</Button>
			),
		},
		{
			accessorKey: "count_tm_male",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">
					{row.original.count_tm_male}
				</div>
			),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					TM Male
				</Button>
			),
		},
		{
			accessorKey: "count_tm_female",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">
					{row.original.count_tm_female}
				</div>
			),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					TM Female
				</Button>
			),
		},
		{
			accessorKey: "count_em_male",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">
					{row.original.count_em_male}
				</div>
			),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					EM Male
				</Button>
			),
		},
		{
			accessorKey: "count_em_female",
			cell: ({ row }) => (
				<div className="text-bold tabular-nums">
					{row.original.count_em_female}
				</div>
			),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					EM Female
				</Button>
			),
		},
	];
	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		data: centreWiseStats,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: not an issue
	const fetchStats = useCallback(async () => {
		toast.loading("Loading...");
		setCentreWiseStats([]);
		Promise.allSettled([
			getCentreWiseStudentsPerSubject(selectedSubject),
			createTimer(),
		]).then(([data]) => {
			toast.dismiss();
			if (data.status === "fulfilled") {
				setCentreWiseStats(data.value.centres);
			} else if (data.status === "rejected") {
				if (typeof data.reason === "string") {
					toast.error(data.reason);
				} else {
					toast.error("Failed to fetch stats");
				}
			}
		});
	}, [table, selectedSubject]);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	return (
		<>
			<PageTitle title="Students (Centre Wise) | Mora Exams" />
			<Breadcrumb pageName="Centre-Wise Students" />

			<div className="space-y-2 mb-5">
				<Label>Showing stats for:</Label>
				<Select
					value={selectedSubject.toString()}
					onValueChange={(value) => setSelectedSubject(Number(value))}
				>
					<SelectTrigger className="w-[220px]">
						<SelectValue placeholder="Subject" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="4">Combined Mathematics</SelectItem>
						<SelectItem value="3">Biology</SelectItem>
						<SelectItem value="1">Physics</SelectItem>
						<SelectItem value="2">Chemistry</SelectItem>
						<SelectItem value="5">ICT</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<DataTable table={table} />
		</>
	);
}
