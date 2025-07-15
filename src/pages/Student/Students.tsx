import { useCallback, useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { getStudents } from "../../services/studentService";
import type { Student } from "../../types/types";

import ReactPaginate from "react-paginate";
import StudentTable from "../../components/Tables/StudentTable";

const Students = () => {
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);
	const [searchKey, setSearchKey] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [totalCount, setTotalCount] = useState<number>(0);

	const fetchStudents = useCallback(async () => {
		try {
			const data = await getStudents(page, itemsPerPage);
			setStudents(data.students);
			setTotalCount(data.count);
		} catch (error) {
			if (typeof error === "string") {
				setError(error);
			} else {
				setError("Failed to fetch users");
			}
		} finally {
			setLoading(false);
		}
	}, [page, itemsPerPage]);

	useEffect(() => {
		fetchStudents();
	}, [fetchStudents]);

	if (error) {
		return <div>{error}</div>;
	}
	return (
		<DefaultLayout>
			<Breadcrumb pageName="Students" />
			<div className="flex gap-4 mb-3 items-center">
					<select
						className="rounded border border-stroke h-full bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
						name="selectItemsPerPage"
						id="selectItemsPerPage"
						value={itemsPerPage}
						onChange={(e) => setItemsPerPage(Number(e.target.value))}
					>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="100">100</option>
						<option value="500">500</option>
					</select>
					<input
						type="text"
						value={searchKey}
						onChange={(e) => setSearchKey(e.target.value)}
						placeholder="Search..."
						className="mr-auto w-full max-w-96 rounded border-[1.5px] border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
					/>
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
					<StudentTable
						page={page}
						studentData={students}
						nameSearchKey={searchKey}
						itemsPerPage={itemsPerPage}
						refetch={fetchStudents}
						total={totalCount}
					/>
				)}
			</div>
		</DefaultLayout>
	);
};

export default Students;
