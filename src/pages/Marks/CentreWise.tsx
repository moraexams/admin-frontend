import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
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
	type CentreWiseMarksStats,
	type MarksStatsForCentre,
	getCentreWiseMarksStats,
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

export default function CentreWiseMarksStats() {
	const [selectedSubject, setSelectedSubject] = useState<number>(1);
	const [stats, setStats] = useState<MarksStatsForCentre[]>([]);

	const columns: Array<ColumnDef<MarksStatsForCentre>> = [
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
			accessorKey: "total_students",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0"
				>
					Total
				</Button>
			),
		},
		{
			accessorKey: "p1_total_entered",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0"
				>
					P1 Entered
				</Button>
			),
		},
		{
			accessorKey: "p1_total_verified",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0"
				>
					P1 Verified
				</Button>
			),
		},
		{
			accessorKey: "p2_total_entered",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0"
				>
					P2 Entered
				</Button>
			),
		},
		{
			accessorKey: "p2_total_verified",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0"
				>
					P2 Verified
				</Button>
			),
		},
	];

	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		data: stats,
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
		setStats([]);
		Promise.allSettled([
			getCentreWiseMarksStats(selectedSubject),
			createTimer(),
		]).then(([data]) => {
			toast.dismiss();
			if (data.status === "fulfilled") {
				setStats(data.value.exam_centres);
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
	useEffect(() => {}, [selectedSubject]);

	return (
		<>
			<PageTitle title="Centre-Wise Marks Stats | Mora Exams" />
			<Breadcrumb pageName="Centre-Wise Marks" />

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
