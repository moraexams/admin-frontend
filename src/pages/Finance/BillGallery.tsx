import type React from "react";
import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { getAllBills } from "../../services/financeServices";

type ImageItem = {
	id: string;
	image_url: string;
	description: string;
	category: string;
};

const Gallery: React.FC = () => {
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("All");
	const [page, setPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [images, setImages] = useState<ImageItem[]>([]);

	const fetchBills = useCallback(async () => {
		setLoading(true);
		try {
			const res = await getAllBills(page, itemsPerPage);
			setTotalCount(res.data.count);
			setImages(res.data.bills); // <-- Use bills from backend
		} catch (error) {
			setError("Failed to fetch bills");
		} finally {
			setLoading(false);
		}
	}, [page, itemsPerPage]);

	useEffect(() => {
		fetchBills();
	}, [fetchBills]);

	if (error) {
		return (
			<div className="dark:bg-boxdark-2 dark:text-bodydark h-screen px-5 py-5">
				<h1 className="text-3xl font-bold mb-4">{error}</h1>
			</div>
		);
	}

	const categories = [
		"All",
		...Array.from(new Set(images.map((img) => img.category))),
	];

	const filteredImages = images.filter(
		(img) =>
			(category === "All" || img.category === category) &&
			img.description.toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<>
			<Breadcrumb pageName="Bill Gallery" dashboardPath="/finance/dashboard" />
			<div className="min-h-screen bg-gray-50 dark:bg-boxdark p-6">
				<div className="max-w-5xl mx-auto">
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="w-full md:w-1/3 rounded-sm border border-stroke bg-white py-2 px-4 text-black focus:border-primary focus:outline-hidden dark:border-strokedark dark:bg-meta-4 dark:text-white"
						>
							{categories.map((cat) => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
						</select>

						<input
							type="text"
							placeholder="Search by description..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="w-full md:flex-1 rounded-sm border border-stroke bg-white py-2 px-4 text-black focus:border-primary focus:outline-hidden dark:border-strokedark dark:bg-meta-4 dark:text-white"
						/>
					</div>

					<div className="mb-5.5 flex justify-between">
						<select
							className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-hidden dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
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
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
						{loading ? (
							<div>Loading...</div>
						) : images.length > 0 ? (
							images
								.filter(
									(img) =>
										(category === "All" || img.category === category) &&
										img.description.toLowerCase().includes(query.toLowerCase()),
								)
								.map((img) => (
									<div
										key={img.id}
										className="bg-white dark:bg-boxdark rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
									>
										<img
											src={img.image_url}
											alt={img.description}
											className="w-full h-48 object-cover"
										/>
										<div className="p-4 flex-1 flex flex-col justify-between">
											<p className="text-sm text-gray-700 dark:text-white">
												{img.description}
											</p>
										</div>
									</div>
								))
						) : (
							<p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
								No images match your search.
							</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Gallery;
