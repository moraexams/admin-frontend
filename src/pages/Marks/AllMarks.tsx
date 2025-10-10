import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { createTimer } from "@/services/utils";
import {
	type ColumnDef,
	type SortingState,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { getStudentMarks } from "../../services/studentService";
import type { StudentMark } from "../../types/types";

export default function AllMarks() {
	const [students, setStudents] = useState<StudentMark[]>([]);
	const [search, setSearch] = useState("");
	const [searchInput, setSearchInput] = useState<string>("");
	const columns: Array<ColumnDef<StudentMark>> = [
		{
			accessorKey: "index_no",
			header: "Index No",
		},
		{
			accessorKey: "name",
			header: "Name",
		},
		{ accessorKey: "stream", header: "Stream" },
		{ accessorKey: "s1_p1", header: "S1 P1" },
		{ accessorKey: "s1_p2", header: "S1 P2" },
		{ accessorKey: "s2_p1", header: "S2 P1" },
		{ accessorKey: "s2_p2", header: "S2 P2" },
		{ accessorKey: "s3_p1", header: "S3 P1" },
		{ accessorKey: "s3_p2", header: "S3 P2" },
	];

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [pageCount, setPageCount] = useState<number>(-1); // total pages
	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		data: students,
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
		manualFiltering: true,
		onPaginationChange: setPagination,
	});

	useEffect(() => {
		toast.loading("Fetching students...");
		const tableState = table.getState();
		const page = tableState.pagination.pageIndex + 1;
		const itemsPerPage = tableState.pagination.pageSize;
		const searchParam = search ? `&search=index_no:${search}` : "";

		Promise.allSettled([
			getStudentMarks(page, itemsPerPage, searchParam),
			createTimer(),
		]).then((data) => {
			toast.dismiss();
			if (data[0].status === "fulfilled") {
				toast.dismiss();
				setStudents(data[0].value.students);
				setPageCount(Math.ceil(data[0].value.count / itemsPerPage));
			} else {
				toast.error("Failed to fetch Students");
			}
		});
	}, [search, pagination]);

	useEffect(() => {
		const handler = setTimeout(() => {
			setSearch(searchInput);
			setPagination((prev) => ({ ...prev, pageIndex: 0 }));
		}, 500);
		return () => clearTimeout(handler);
	}, [searchInput]);

	return (
		<>
			<PageTitle title="All Marks | Mora Exams" />
			<Breadcrumb pageName="All Marks" />

			<div className="grid grid-cols-2 grid-rows-1 gap-x-4">
				<p className="mb-4 max-w-prose">
					In the below table, you can view marks of students. You can search
					students by index no.
				</p>
				<div className="col-start-2 row-start-1 row-span-full">
					<h2 className="text-xl font-medium mb-2">Search by Index No.</h2>
					<Input
						type="text"
						placeholder="Search..."
						className="max-w-[320px] border p-2 rounded"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
				</div>
			</div>

			<DataTable table={table} />
		</>
	);
}
