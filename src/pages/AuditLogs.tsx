import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import PaginationPageSizeSelector from "../components/PaginationPageSizeSelector";
import Table from "../components/Table";
import { type AuditLogItem, getAuditLogs } from "../services/auditLogService";

export default function AuditLogs() {
	const [logs, setLogs] = useState<Array<AuditLogItem>>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [totalCount, setTotalCount] = useState<number>(0);

	useEffect(() => {
		getAuditLogs(currentPage, pageSize)
			.then((response) => {
				setLogs(response.data.logs);
				setTotalCount(response.data.count);
			})
			.catch((error) => {
				console.error("Error fetching audit logs:", error);
				toast.error("Failed to fetch audit logs. Please try again later.");
			});
	}, [currentPage, pageSize]);

	return (
		<>
			<Breadcrumb pageName="Audit Logs" />

			<div className="mb-5.5 flex justify-between">
				<PaginationPageSizeSelector
					id="audit-logs"
					value={pageSize}
					onChange={(size) => {
						setCurrentPage(1);
						setPageSize(size);
					}}
				/>
				<ReactPaginate
					breakLabel="..."
					nextLabel=">"
					onPageChange={(event: { selected: number }) => {
						setCurrentPage(event.selected + 1);
					}}
					pageRangeDisplayed={1}
					forcePage={currentPage - 1}
					pageCount={Math.ceil(totalCount / pageSize)}
					previousLabel="<"
					renderOnZeroPageCount={null}
					containerClassName={
						"isolate inline-flex -space-x-px rounded-md shadow-xs"
					}
					pageLinkClassName={
						"relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					}
					breakLinkClassName={
						"relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
					}
					activeLinkClassName={
						"z-10 bg-secondary text-white focus:z-20 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
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

			<Table
				headers={["Id", "Timestamp", "Action", "Entity", "Performed by"]}
				data={logs.map((log) => [
					log.id,
					new Date(log.timestamp).toLocaleString("en-GB"),
					log.action,
					log.entity_type,
					log.performed_by,
				])}
			/>
		</>
	);
}
