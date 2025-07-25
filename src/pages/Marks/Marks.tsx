import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { MarksBoundariesView } from "../../components/MarksBoundariesView";
import DefaultLayout from "../../layout/DefaultLayout";

const PERMISSION__MARKS_BOUNDARY_VIEW = ["PRESIDENT", "TECH_COORDINATOR"];

const Marks = () => {
	const navigate = useNavigate();
	const role = localStorage.getItem("role");

	const handleEdit = (subject: number, part: number) => {
		navigate(`/marks/enter?subject=s${subject}&part=p${part}`);
	};

	const handleVerify = (subject: number, part: number) => {
		navigate(`/marks/verify?subject=s${subject}&part=p${part}`);
	};

	return (
		<DefaultLayout>
			<Breadcrumb pageName="Marks" />
			<div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
				<div className="max-w-full overflow-x-auto">
					<table className="w-full table-auto">
						<thead>
							<tr className="bg-gray-2 dark:bg-meta-4">
								<th className="min-w-[120px] py-4 px-4 font-medium text-black text-left dark:text-white">
									Subject
								</th>
								<th className="min-w-[120px] py-4 px-4 font-medium text-black text-center dark:text-white">
									Part 1
								</th>
								<th className="min-w-[120px] py-4 px-4 font-medium text-black text-center dark:text-white">
									Part 2
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-left font-bold">
									Bio/Maths
								</td>
								<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
									<div className="flex items-center justify-center space-x-3.5">
										<button
											type="button"
											onClick={() => {
												handleEdit(1, 1);
											}}
											className="transition-colors hover:bg-bodydark1 bg-gray-2 dark:bg-meta-4 dark:hover:bg-body px-2 py-1 rounded-lg"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="inline-block mr-2 size-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
												/>
											</svg>
											<span className="font-semibold">Edit</span>
										</button>
										<button
											type="button"
											className="transition-colors hover:bg-bodydark1 bg-gray-2 dark:bg-meta-4 dark:hover:bg-body px-2 py-1 rounded-lg"
											onClick={() => {
												handleVerify(1, 1);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="inline-block mr-2 size-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
												/>
											</svg>
											<span className="font-semibold">Verify</span>
										</button>
									</div>
								</td>
								<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
									<div className="flex items-center justify-center space-x-3.5">
										<button
											type="button"
											onClick={() => {
												handleEdit(1, 2);
											}}
											className="transition-colors hover:bg-bodydark1 bg-gray-2 dark:bg-meta-4 dark:hover:bg-body px-2 py-1 rounded-lg"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6 mr-2 inline-block"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
												/>
											</svg>
											<span className="font-semibold">Edit</span>
										</button>
										<button
											type="button"
											className="transition-colors hover:bg-bodydark1 bg-gray-2 dark:bg-meta-4 dark:hover:bg-body px-2 py-1 rounded-lg"
											onClick={() => {
												handleVerify(1, 2);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6 inline-block mr-2"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
												/>
											</svg>
											<span className="font-semibold">Verify</span>
										</button>
									</div>
								</td>
							</tr>
							<tr>
								<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-left font-bold">
									Physics
								</td>
								<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
									<div className="flex items-center justify-center space-x-3.5">
										<button
											type="button"
											onClick={() => {
												handleEdit(2, 1);
											}}
											className="transition-colors hover:bg-bodydark1 bg-gray-2 dark:bg-meta-4 dark:hover:bg-body px-2 py-1 rounded-lg"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6 inline-block mr-2"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
												/>
											</svg>
											<span className="font-semibold">Edit</span>
										</button>
										<button
											type="button"
											className="transition-colors hover:bg-bodydark1 bg-gray-2 dark:bg-meta-4 dark:hover:bg-body px-2 py-1 rounded-lg"
											onClick={() => {
												handleVerify(2, 1);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6 inline-block mr-2"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
												/>
											</svg>
											<span className="font-semibold">Verify</span>
										</button>
									</div>
								</td>
								<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
									<div className="flex items-center justify-center space-x-3.5">
										<button
											type="button"
											onClick={() => {
												handleEdit(2, 2);
											}}
											className="transition-colors hover:bg-bodydark1 bg-gray-2 dark:bg-meta-4 dark:hover:bg-body px-2 py-1 rounded-lg"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6 inline-block mr-2"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
												/>
											</svg>
											<span className="font-semibold">Edit</span>
										</button>
										<button
											type="button"
											className="transition-colors hover:bg-bodydark1 bg-gray-2 dark:bg-meta-4 dark:hover:bg-body px-2 py-1 rounded-lg"
											onClick={() => {
												handleVerify(2, 2);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6 inline-block mr-2"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
												/>
											</svg>
											<span className="font-semibold">Verify</span>
										</button>
									</div>
								</td>
							</tr>
							<tr>
								<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark font-bold">
									Chem/ICT
								</td>
								<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
									<div className="flex items-center justify-center space-x-3.5">
										<button
											type="button"
											onClick={() => {
												handleEdit(3, 1);
											}}
											className="transition-colors hover:bg-bodydark1 bg-gray-2 dark:bg-meta-4 dark:hover:bg-body px-2 py-1 rounded-lg"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6 inline-block mr-2"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
												/>
											</svg>
											<span className="font-semibold">Edit</span>
										</button>
										<button
											type="button"
											className="transition-colors hover:bg-bodydark1 bg-gray-2 dark:bg-meta-4 dark:hover:bg-body px-2 py-1 rounded-lg"
											onClick={() => {
												handleVerify(3, 1);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6 inline-block mr-2"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
												/>
											</svg>
											<span className="font-semibold">Verify</span>
										</button>
									</div>
								</td>
								<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
									<div className="flex items-center justify-center space-x-3.5">
										<button
											type="button"
											onClick={() => {
												handleEdit(3, 2);
											}}
											className="transition-colors hover:bg-bodydark1 bg-gray-2 dark:bg-meta-4 dark:hover:bg-body px-2 py-1 rounded-lg"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6 mr-2 inline-block"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
												/>
											</svg>
											<span className="font-semibold">Edit</span>
										</button>
										<button
											type="button"
											className="transition-colors hover:bg-bodydark1 bg-gray-2 dark:bg-meta-4 dark:hover:bg-body px-2 py-1 rounded-lg"
											onClick={() => {
												handleVerify(3, 2);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6 inline-block mr-2"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
												/>
											</svg>
											<span className="font-semibold">Verify</span>
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			{typeof role === "string" &&
			PERMISSION__MARKS_BOUNDARY_VIEW.includes(role) ? (
				<MarksBoundariesView />
			) : null}
		</DefaultLayout>
	);
};

export default Marks;
