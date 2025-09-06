import { ROLE_COORDINATOR } from "@/common/roles";
import { LOCAL_STORAGE__ROLE } from "@/services/authServices";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardDataStats from "../components/CardDataStats";
import { getDistrictsWithCentres } from "../services/districtService";
import {
	getStatCounts,
	getStatsByCentre,
	getStatsStreamWise,
} from "../services/statsServices";
import type { District } from "../types/types";

const Dashboard: React.FC = () => {
	const navigate = useNavigate();
	const [counts, setCounts] = useState<any>({});
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [districts, setDistricts] = useState<District[]>([]);
	const [district, setDistrict] = useState<number>(1);
	const [centre, setCentre] = useState<number>(1);
	const [centreStats, setCentreStats] = useState<any>({});
	const [streamStats, setStreamStats] = useState<any>({});

	useEffect(() => {
		const role = localStorage.getItem(LOCAL_STORAGE__ROLE);
		if (role === ROLE_COORDINATOR) {
			navigate("/admissions");
		}

		const fetchStats = async () => {
			try {
				const counts = await getStatCounts();
				setCounts(counts);
			} catch (error) {
				setError("Failed to fetch counts");
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

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
				const stStats = await getStatsStreamWise();
				// console.log(stStats);
				setStreamStats(stStats);
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
				const stats = await getStatsByCentre(centre);
				setCentreStats(stats);
			} catch (error) {
				setError("Failed to fetch centres");
			} finally {
				setLoading(false);
			}
		};
		fetchStudents();
	}, [centre]);

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<>
			{/* <div>
        <h1 className="text-3xl font-semibold text-primary">Dashboard on progress...</h1>
      </div> */}
			{loading ? (
				<div>Loading...</div>
			) : (
				<>
					<div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 xl:grid-cols-4 2xl:gap-5">
						<CardDataStats title="Total Students" total={counts.student} />
						<CardDataStats title="Total Centers" total={counts.exam_center} />
						<CardDataStats
							title="Total Coordinators"
							total={counts.coordinator}
						/>
						<CardDataStats title="Total Users" total={counts.user} />
					</div>
					<div className="mt-8 mb-5">
						<h2 className="text-xl font-semibold text-black dark:text-white">
							Total Stream Wise Stats
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
										Tamil
									</th>
									<th className="py-4 px-4 text-black dark:text-white">
										English
									</th>
									<th className="py-4 px-4 text-black dark:text-white">
										Total
									</th>
								</tr>
							</thead>
							<tbody>
								<>
									{streamStats.counts?.map((count: any, key: number) => (
										<tr key={key}>
											<td className="border-b border-[#eee] py-5 px-4 pl-4 dark:border-strokedark xl:pl-11">
												<h5 className="font-medium text-black dark:text-white">
													{count.stream_name}
												</h5>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">
													{count.tamil_count}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">
													{count.english_count}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="font-semibold text-black dark:text-white">
													{count.total_count}
												</p>
											</td>
										</tr>
									))}
									<tr className="font-semibold">
										<td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
											<h5 className="text-black dark:text-white">
												<strong>Total</strong>
											</h5>
										</td>
										<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
											<p className="text-black dark:text-white">
												{streamStats.total_tamil}
											</p>
										</td>
										<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
											<p className="text-black dark:text-white">
												{streamStats.total_english}
											</p>
										</td>
										<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
											<p className="font-bold text-primary dark:text-white">
												<strong>
													{streamStats.total_tamil + streamStats.total_english}
												</strong>
											</p>
										</td>
									</tr>
								</>
							</tbody>
						</table>
					</div>
					<div className="rounded-xs border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-4 xl:mt-6 2xl:mt-7.5">
						<div>
							<div className="mb-6">
								<h2 className="text-xl font-semibold text-black dark:text-white">
									Centre Wise Stats
								</h2>
							</div>
							<div className="flex flex-wrap gap-x-4">
								<div className="mb-5.5">
									<select
										className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-hidden dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
										name="selectDistrict"
										id="selectDistrict"
										value={district.toString()}
										onChange={(e) =>
											handleDistrictSelect(Number(e.target.value))
										}
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
												Male
											</th>
											<th className="py-4 px-4 text-black dark:text-white">
												Female
											</th>
											<th className="py-4 px-4 text-black dark:text-white">
												Total
											</th>
										</tr>
									</thead>
									<tbody>
										<>
											{centreStats.counts?.map((count: any, key: number) => (
												<tr key={key}>
													<td className="border-b border-[#eee] py-5 px-4 pl-4 dark:border-strokedark xl:pl-11">
														<h5 className="font-medium text-black dark:text-white">
															{count.stream_name}
														</h5>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="text-black dark:text-white">
															{count.male_count}
														</p>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="text-black dark:text-white">
															{count.female_count}
														</p>
													</td>
													<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
														<p className="font-semibold text-black dark:text-white">
															{count.total_count}
														</p>
													</td>
												</tr>
											))}
											<tr className="font-semibold">
												<td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
													<h5 className="text-black dark:text-white">
														<strong>Total</strong>
													</h5>
												</td>
												<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
													<p className="text-black dark:text-white">
														{centreStats.total_male}
													</p>
												</td>
												<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
													<p className="text-black dark:text-white">
														{centreStats.total_female}
													</p>
												</td>
												<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
													<p className="font-bold text-primary dark:text-white">
														<strong>
															{centreStats.total_male +
																centreStats.total_female}
														</strong>
													</p>
												</td>
											</tr>
										</>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Dashboard;
