import type React from "react";
import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { getDistrictsWithCentres } from "../../services/districtService";
import {
	getEnteredMarksStatsByCentre,
	getTotalEnteredMarksStats,
} from "../../services/statsServices";
import type { District } from "../../types/types";

const EnteredStudentMarks: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [districts, setDistricts] = useState<District[]>([]);
	const [district, setDistrict] = useState<number>(1);
	const [centre, setCentre] = useState<number>(1);
	const [centreStats, setCentreStats] = useState<any>([]);
	const [totalStats, setTotalStats] = useState<any>([]);

	const handleDistrictSelect = (districtId: number) => {
		setDistrict(districtId);
		const firstCentre = districts.find((d) => d.id === districtId)
			?.exam_centres?.[0];
		setCentre(firstCentre?.id || 1);
	};
	useEffect(() => {
		const fetchData = async () => {
			try {
				const districts = await getDistrictsWithCentres();
				setDistricts(districts);
				const tStats = await getTotalEnteredMarksStats();
				// console.log(tStats);
				setTotalStats(tStats);
			} catch (error) {
				setError("Failed to fetch data");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const stats = await getEnteredMarksStatsByCentre(centre);
				setCentreStats(stats);
			} catch (error) {
				setError("Failed to fetch centres");
			} finally {
				setLoading(false);
			}
		};
		fetchStudents();
	}, [district, centre]);

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<>
			<Breadcrumb pageName="Entered Mark Stats" />
			{loading ? (
				<div>Loading...</div>
			) : (
				<>
					<div>
						<div className="mb-6">
							<h2 className="text-xl font-semibold text-black dark:text-white">
								Total Stream Wise Entered Stats
							</h2>
						</div>
						<div className="max-w-full overflow-x-auto">
							<table className="w-full table-auto">
								<thead>
									<tr className="bg-gray-2 dark:bg-meta-4 font-bold text-left">
										<th className="py-4 px-4 pl-4 xl:pl-11 text-black dark:text-white">
											Stream
										</th>
										<th className="py-4 px-4 text-black dark:text-white">
											Total
										</th>
										<th className="py-4 px-4 text-black dark:text-white">
											S1 P1
										</th>
										<th className="py-4 px-4 text-black dark:text-white">
											S1 P2
										</th>
										<th className="py-4 px-4 text-black dark:text-white">
											S2 P1
										</th>
										<th className="py-4 px-4 text-black dark:text-white">
											S2 P2
										</th>
										<th className="py-4 px-4 text-black dark:text-white">
											S3 P1
										</th>
										<th className="py-4 px-4 text-black dark:text-white">
											S3 P2
										</th>
									</tr>
								</thead>
								<tbody>
									<>
										{totalStats &&
											totalStats.map((count: any, key: number) => (
												<tr key={key}>
													<td className="border-b border-[#eee] py-5 px-4 pl-4 dark:border-strokedark xl:pl-11">
														<h5 className="font-semibold text-black dark:text-white">
															{count.stream_name}
														</h5>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="font-bold text-black dark:text-white">
															{count.total_count}
														</p>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="text-black dark:text-white">
															{count.s1_p1_count}
														</p>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="text-black dark:text-white">
															{count.s1_p2_count}
														</p>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="text-black dark:text-white">
															{count.s2_p1_count}
														</p>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="text-black dark:text-white">
															{count.s2_p2_count}
														</p>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="text-black dark:text-white">
															{count.s3_p1_count}
														</p>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="text-black dark:text-white">
															{count.s3_p2_count}
														</p>
													</td>
												</tr>
											))}
									</>
								</tbody>
							</table>
						</div>
					</div>
					<div>
						<div className="mt-8 mb-6">
							<h2 className="text-xl font-semibold text-black dark:text-white">
								Stream Wise Entered Stats by Centre
							</h2>
						</div>
						<div className="flex flex-wrap gap-x-4">
							<div className="mb-5.5">
								<select
									className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-hidden dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
									name="selectDistrict"
									id="selectDistrict"
									value={district.toString()}
									onChange={(e) => handleDistrictSelect(Number(e.target.value))}
								>
									{districts.map((district) => {
										return (
											<option key={district.id} value={district.id}>
												{district.name}
											</option>
										);
									})}
								</select>
							</div>
							<div className="mb-5.5">
								<select
									className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-hidden dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
									name="selectCentre"
									id="selectCentre"
									value={centre.toString()}
									onChange={(e) => setCentre(Number(e.target.value))}
								>
									{districts
										.find((d) => d.id === district)
										?.exam_centres?.map((centre) => (
											<option key={centre.id} value={centre.id}>
												{centre.name.length > 32
													? `${centre.name.substring(0, 30)}...`
													: centre.name}
											</option>
										))}
								</select>
							</div>
						</div>

						<div className="max-w-full overflow-x-auto">
							<table className="w-full table-auto">
								<thead>
									<tr className="bg-gray-2 dark:bg-meta-4 font-bold text-left">
										<th className="py-4 px-4 pl-4 xl:pl-11 text-black dark:text-white">
											Stream
										</th>
										<th className="py-4 px-4 text-black dark:text-white">
											Total
										</th>
										<th className="py-4 px-4 text-black dark:text-white">
											S1 P1
										</th>
										<th className="py-4 px-4 text-black dark:text-white">
											S1 P2
										</th>
										<th className="py-4 px-4 text-black dark:text-white">
											S2 P1
										</th>
										<th className="py-4 px-4 text-black dark:text-white">
											S2 P2
										</th>
										<th className="py-4 px-4 text-black dark:text-white">
											S3 P1
										</th>
										<th className="py-4 px-4 text-black dark:text-white">
											S3 P2
										</th>
									</tr>
								</thead>
								<tbody>
									<>
										{centreStats &&
											centreStats.map((count: any, key: number) => (
												<tr key={key}>
													<td className="border-b border-[#eee] py-5 px-4 pl-4 dark:border-strokedark xl:pl-11">
														<h5 className="font-semibold text-black dark:text-white">
															{count.stream_name}
														</h5>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="font-bold text-black dark:text-white">
															{count.total_count}
														</p>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="text-black dark:text-white">
															{count.s1_p1_count}
														</p>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="text-black dark:text-white">
															{count.s1_p2_count}
														</p>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="text-black dark:text-white">
															{count.s2_p1_count}
														</p>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="text-black dark:text-white">
															{count.s2_p2_count}
														</p>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="text-black dark:text-white">
															{count.s3_p1_count}
														</p>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="text-black dark:text-white">
															{count.s3_p2_count}
														</p>
													</td>
												</tr>
											))}
									</>
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default EnteredStudentMarks;
