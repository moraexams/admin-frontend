import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getDistrictsWithCentres } from "@/services/districtService";
import {
	type CentreWiseStats,
	getStatsByCentre,
} from "@/services/statsServices";
import type { District } from "@/types/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CentreWiseStats() {
	const [centreStats, setCentreStats] = useState<CentreWiseStats>({
		counts: [],
		total_female: 0,
		total_male: 0,
	});
	const [centreId, setCentreId] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [districts, setDistricts] = useState<District[]>([]);
	const [district, setDistrict] = useState<number>(1);

	useEffect(() => {
		setIsLoading(true);
		Promise.all([getStatsByCentre(centreId), getDistrictsWithCentres()])
			.then(([stats, districts]) => {
				setCentreStats(stats);
				setDistricts(districts);
			})
			.catch((error) => {
				console.error("Error fetching stream wise stats:", error);
				toast.error("Failed to fetch stream wise stats.");
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	const handleDistrictSelect = (districtId: number) => {
		setDistrict(districtId);
		const firstCentre = districts.find((d) => d.id === districtId)
			?.exam_centres?.[0];
		setCentreId(firstCentre?.id || 1);
	};

	useEffect(() => {
		getStatsByCentre(centreId)
			.then((stats) => {
				setCentreStats(stats);
			})
			.catch((error) => {
				console.error(error);
				toast.error("Failed to fetch centres");
			});
	}, [centreId]);

	return (
		<>
			<div className="mt-8 mb-6">
				<h2 className="text-xl font-semibold text-black dark:text-white">
					Centre Wise Stats
				</h2>
			</div>
			<div className="flex flex-wrap gap-x-4 mb-4">
				<Select
					defaultValue={district.toString()}
					onValueChange={(v) => {
						handleDistrictSelect(Number.parseInt(v));
					}}
					name="selectDistrict"
				>
					<SelectTrigger className="w-fit text-base">
						<SelectValue placeholder="District" />
					</SelectTrigger>
					<SelectContent>
						{districts.map((district) => {
							if (district.id === undefined) return null;
							return (
								<SelectItem key={district.id} value={district.id.toString()}>
									{district.name}
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>

				<Select
					name="selectCentre"
					value={centreId.toString()}
					onValueChange={(v) => setCentreId(Number.parseInt(v))}
				>
					<SelectTrigger className="w-fit text-base">
						<SelectValue placeholder="Exam Centre" />
					</SelectTrigger>
					<SelectContent>
						{districts
							.find((d) => d.id === district)
							?.exam_centres?.map((centre) =>
								centre.id === undefined ? null : (
									<SelectItem key={centre.id} value={centre.id?.toString()}>
										{centre.name.length > 40
											? `${centre.name.substring(0, 40)}...`
											: centre.name}
									</SelectItem>
								),
							)}
					</SelectContent>
				</Select>
			</div>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<div className="max-w-full overflow-x-auto">
					<table className="w-full table-auto">
						<thead>
							<tr className="bg-gray-2 dark:bg-meta-4 font-bold text-left">
								<th className="py-4 px-4 pl-4 xl:pl-11 text-black dark:text-white">
									Stream
								</th>
								<th className="py-4 px-4 text-black dark:text-white">Male</th>
								<th className="py-4 px-4 text-black dark:text-white">Female</th>
								<th className="py-4 px-4 text-black dark:text-white">Total</th>
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
												{centreStats.total_male + centreStats.total_female}
											</strong>
										</p>
									</td>
								</tr>
							</>
						</tbody>
					</table>
				</div>
			)}
		</>
	);
}
