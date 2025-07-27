import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import TransactionsTable from "../../components/Tables/TransactionsTable";
import DefaultLayout from "../../layout/DefaultLayout";
import { getTransactions } from "../../services/financeServices";
import type { Transaction } from "../../types/finance";

export default function Transactions() {
	const [transactions, setTransactions] = useState<Array<Transaction>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);
	const [page, setPage] = useState<number>(1);
	const [totalCount, setTotalCount] = useState<number>(0);

	const fetchTransactions = useCallback(async () => {
		try {
			const d = await getTransactions(page, itemsPerPage);
			setTotalCount(d.count);
			setTransactions(d.transactions);
		} catch (error) {
			if (typeof error === "string") {
				setError(error);
			} else {
				setError("Failed to fetch transactions");
			}
		} finally {
			setLoading(false);
		}
	}, [page, itemsPerPage]);

	useEffect(() => {
		fetchTransactions();
	}, [page, itemsPerPage]);

	if (error) {
		return (
			<div className="dark:bg-boxdark-2 dark:text-bodydark h-screen px-5 py-5">
				<h1 className="text-3xl font-bold mb-4">{error}</h1>
				<NavLink className="text-xl hover:underline" to="/">
					Go home
				</NavLink>
			</div>
		);
	}

	return (
		<DefaultLayout>
			<Breadcrumb pageName="Transactions" dashboardPath="/finance/dashboard" />

			<div className="mb-5.5 flex justify-between">
				<select
					className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
					name="selectDoctor"
					id="selectDoctor"
					value={itemsPerPage}
					onChange={(e) => {
						setPage(1);
						setItemsPerPage(Number(e.target.value));
					}}
				>
					<option value="5">5</option>
					<option value="10">10</option>
					<option value="100">100</option>
					<option value="500">500</option>
				</select>

				<ReactPaginate
					breakLabel="..."
					nextLabel=">"
					onPageChange={(event: { selected: number }) => {
						setPage(event.selected + 1);
					}}
					pageRangeDisplayed={1}
					forcePage={page - 1}
					pageCount={Math.ceil(totalCount / itemsPerPage)}
					previousLabel="<"
					renderOnZeroPageCount={null}
					containerClassName={
						"isolate inline-flex -space-x-px rounded-md shadow-sm"
					}
					pageLinkClassName={
						"relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					}
					breakLinkClassName={
						"relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					}
					activeLinkClassName={
						"z-10 bg-secondary text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
					}
					previousLinkClassName={
						"relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					}
					nextLinkClassName={
						"relative inline-flex items-center rounded-r-md px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-gray-400"
					}
					disabledLinkClassName={"text-black-100"}
				/>
			</div>
			<div className="flex flex-col gap-10">
				{loading ? (
					<div>Loading...</div>
				) : (
					<TransactionsTable
						page={page}
						itemsPerPage={itemsPerPage}
						refetch={fetchTransactions}
						total={totalCount}
						data={transactions}
					/>
				)}
			</div>
		</DefaultLayout>
	);
}
