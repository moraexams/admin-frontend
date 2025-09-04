import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getDistrictsOverview } from "@/services/districtService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface DistrictItem {
	id: number;
	name: string;
	exam_centres: Array<unknown>;


}

export default function DistrictsOverview() {
	const [data, setData] = useState<Array<DistrictItem> | null>(null);

	const fetchData = async () => {
		getDistrictsOverview()
			.then((res) => {
				setData(res);
			})
			.catch((err) => {
				console.error("Error fetching districts overview:", err);
				toast.error("Error fetching districts overview");
			});
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<Breadcrumb pageName="Districts" />

			<main>
				{data === null ? (
					<div>Loading...</div>
				) : (
					data.map((d) => {
						return (
							<section>
								<div className="flex gap-2">
									<h2 key={d.id} className="text-xl font-semibold mb-4">
										{d.name}
									</h2>

									<span>{d.exam_centres.length} Centres</span>
								</div>
							</section>
						);
					})
				)}
			</main>
		</>
	);
}
