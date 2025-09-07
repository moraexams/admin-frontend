import { useEffect, useState } from "react";
import React from "react";
import ReactPaginate from "react-paginate";
import { filterIt } from "../../services/utils";
import type { Count, District } from "../../types/types";

const ExamPaperDistributionTable = ({
	districtData,
	searchKey,
	itemsPerPage,
}: { districtData: District[]; searchKey: string; itemsPerPage: number }) => {
	const [item, setItem] = useState<District[]>();
	useEffect(() => {
		const defaultCount: Count = {
			subject: "-",
			code: "-",
			medium: "-",
			count: 0,
		};

		const updatedDistricts = districtData.map((district) => ({
			...district,
			exam_centres: district.exam_centres?.map((centre) => ({
				...centre,
				counts: centre.counts
					? centre.counts.map((count) => ({
							...count,
							count: count.count ?? 0, // If count is missing, set to 0
						}))
					: [defaultCount], // If counts is null, create a default count
			})),
		}));

		setItem(updatedDistricts);
	}, []);

	const items: District[] =
		searchKey !== "" ? filterIt(item, searchKey) : districtData;
	const itemsLength = items.length;
	const [itemOffset, setItemOffset] = useState(0);

	const endOffset = itemOffset + itemsPerPage;
	console.log(`Loading items from ${itemOffset} to ${endOffset}`);
	const currentItems = item?.slice(itemOffset, endOffset);
	const pageCount = Math.ceil(itemsLength / itemsPerPage);

	// Invoke when district click to request another page.
	const handlePageClick = (event: { selected: number }) => {
		const newOffset = (event.selected * itemsPerPage) % itemsLength;
		setItemOffset(newOffset);
	};

	console.log("items ", items);
	console.log("item ", item);
	return (
		<div className="rounded-xs border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
			<div className="max-w-full overflow-x-auto">
				<table className="w-full table-auto">
					<thead>
						<tr className="bg-gray-2 text-left dark:bg-meta-4">
							<th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
								District Name
							</th>
							<th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
								Centre Name
							</th>
							<th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
								Subject
							</th>
							<th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
								Medium
							</th>
							<th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
								Student Count
							</th>
							<th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
								Bus Route
							</th>
							<th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
								Coordinator Name <br />
								(Tel. Number)
							</th>
						</tr>
					</thead>
					<tbody>
						{currentItems?.map((district) => {
							const { id: d_id, name, exam_centres, coordinators } = district;
							// const count = exam_centres?.map(exam_centres =>  ...exam_centres.counts);
							// console.log("count " , name , count)
							let districtrowSpan = 0;

							if (exam_centres) {
								for (const center of exam_centres) {
									districtrowSpan += center?.counts?.length;
								}
							}

							// console.log("districtrowSpan", districtrowSpan)
							return (
								<>
									{exam_centres && exam_centres.length > 0 ? (
										exam_centres.map((exam_centre, ckey) => {
											const {
												name: centrename,
												counts,
												bus_route,
											} = exam_centre;
											const centrerowSpan = counts ? counts.length : 1;
											return (
												<>
													{counts.map((paper_count, pkey) => {
														const { subject, code, medium, count } =
															paper_count;
														return (
															<tr key={pkey} className="text-center">
																{pkey === 0 && ckey === 0 && (
																	<td
																		rowSpan={districtrowSpan}
																		className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
																	>
																		<p className="text-black dark:text-white">
																			({d_id}) {name}
																		</p>
																	</td>
																)}

																{pkey === 0 && (
																	<td
																		rowSpan={centrerowSpan}
																		className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
																	>
																		<p className="text-black dark:text-white">
																			{centrename}
																		</p>
																	</td>
																)}

																<React.Fragment key={code}>
																	<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
																		<p className="text-black dark:text-white">
																			{subject}
																		</p>
																	</td>
																	<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
																		<p className="text-black dark:text-white">
																			{medium}
																		</p>
																	</td>
																	<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
																		<p className="text-black dark:text-white">
																			{count === 0 ? "-" : count}
																		</p>
																	</td>
																</React.Fragment>
																{pkey === 0 && (
																	<td
																		rowSpan={centrerowSpan}
																		className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
																	>
																		<p className="text-black dark:text-white">
																			{bus_route ? bus_route : "-"}
																		</p>
																	</td>
																)}
																{ckey === 0 && pkey === 0 && (
																	<td
																		rowSpan={districtrowSpan}
																		className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
																		style={{ minWidth: "200px" }}
																	>
																		{coordinators && coordinators.length > 0 ? (
																			coordinators?.map((coordinator) => (
																				<h5
																					className="font-medium text-black dark:text-white"
																					key={coordinator.id}
																				>
																					<div className="m-1">
																						{coordinator.name}
																					</div>
																					<div>
																						({coordinator.telephone_no})
																					</div>
																				</h5>
																			))
																		) : (
																			<p className="text-black dark:text-white">
																				-
																			</p>
																		)}
																	</td>
																)}
															</tr>
														);
													})}
												</>
											);
										})
									) : (
										<tr key={d_id} className="text-center">
											<td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
												<h5 className="font-medium text-black dark:text-white">
													{d_id}
												</h5>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">{name}</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">-</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">-</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">-</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">-</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">-</p>
											</td>
											<td
												className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
												style={{ minWidth: "200px" }}
											>
												{coordinators && coordinators?.length > 0 ? (
													coordinators?.map((coordinator) => (
														<h5
															key={coordinator.name.concat(
																coordinator.telephone_no,
															)}
															className="font-medium text-black dark:text-white"
														>
															<div className="m-1">{coordinator.name}</div>
															<div>({coordinator.telephone_no})</div>
														</h5>
													))
												) : (
													<p className="text-black dark:text-white">-</p>
												)}
											</td>
										</tr>
									)}
								</>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className="flex flex-wrap justify-between my-2">
				<div className="flex items-center my-2">
					Showing {itemOffset + 1} to{" "}
					{endOffset < itemsLength ? endOffset : itemsLength} out of{" "}
					{itemsLength}
				</div>
				<div className="overflow-x-auto my-2">
					<ReactPaginate
						breakLabel="..."
						nextLabel=">"
						onPageChange={handlePageClick}
						pageRangeDisplayed={1}
						pageCount={pageCount}
						previousLabel="<"
						renderOnZeroPageCount={null}
						containerClassName={
							"isolate inline-flex -space-x-px rounded-md shadow-xs"
						}
						pageLinkClassName={
							"relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-secondary hover:text-white focus:z-20 focus:outline-offset-0"
						}
						breakLinkClassName={
							"relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-secondary hover:text-white focus:z-20 focus:outline-offset-0"
						}
						activeLinkClassName={
							"z-10 bg-secondary text-white focus:z-20 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-600"
						}
						previousLinkClassName={
							"relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-secondary hover:text-white focus:z-20 focus:outline-offset-0"
						}
						nextLinkClassName={
							"relative inline-flex items-center rounded-r-md px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-secondary hover:bg-secondary hover:text-white"
						}
						disabledLinkClassName={"text-black-100"}
					/>
				</div>
			</div>
		</div>
	);
};

export default ExamPaperDistributionTable;
