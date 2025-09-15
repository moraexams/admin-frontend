import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { dateTimeFormatter } from "@/lib/utils";
import { getCoordinatorPayments } from "@/services/payment.service";
import { CurrencyFormatter } from "@/services/utils";
import type { CoordinatorPayment } from "@/types/types";
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

export default function CoordinatorPayments() {
	const [coordinatorPayments, setCoordinatorPayments] = useState<
		CoordinatorPayment[]
	>([]);

	const columns: Array<ColumnDef<CoordinatorPayment>> = [
		{
			accessorKey: "payment_id",
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
			accessorKey: "added_by",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0"
				>
					Added By
				</Button>
			),
		},
		{
			id: "amount",
			accessorFn: (row) => CurrencyFormatter.format(row.amount),
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Amount
				</Button>
			),
		},
		{
			accessorFn: (row) => dateTimeFormatter.format(new Date(row.added_at)),
			id: "added_at",
			header: ({ column }) => (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Created At
				</Button>
			),
		},
		// {
		// 	header: "Actions",
		// 	cell: ({ row }) => (
		// 		<div className="flex gap-2">
		// 			<Button
		// 				size="icon"
		// 				variant="outline"
		// 				onClick={() => {
		// 					setSelectedUser(row.original);
		// 					setAction("edit");
		// 				} }
		// 			>
		// 				<Pen />
		// 			</Button>
		// 			<Button
		// 				size="icon"
		// 				variant="destructive"
		// 				onClick={() => {
		// 					setSelectedUser(row.original);
		// 					setAction("delete");
		// 				} }
		// 			>
		// 				<Trash />
		// 			</Button>
		// 		</div>
		// 	),
		// },
	];
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [pageCount, setPageCount] = useState<number>(-1); // total pages
	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		data: coordinatorPayments,
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

	const fetchCoordinatorPayments = useCallback(async () => {
		const tableState = table.getState();
		const page = tableState.pagination.pageIndex + 1;
		const itemsPerPage = tableState.pagination.pageSize;
		toast.loading("Loading...");
		try {
			const data = await getCoordinatorPayments(page, itemsPerPage);
			setCoordinatorPayments(data.coordinator_payments);
			setPageCount(Math.ceil(data.count / itemsPerPage));
			toast.dismiss();
		} catch (error) {
			toast.dismiss();
			if (typeof error === "string") {
				toast.error(error);
			} else {
				toast.error("Failed to fetch coordinator payments");
			}
		}
	}, [table]);

	useEffect(() => {
		fetchCoordinatorPayments();
	}, [fetchCoordinatorPayments, pagination]);

	return (
		<>
			<Breadcrumb pageName="Coordinator Payments" />
			<DataTable table={table} />
		</>
	);
}
