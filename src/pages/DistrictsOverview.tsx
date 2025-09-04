import { capitalize } from "@/common/utils";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getDistrictsOverview } from "@/services/districtService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface DistrictItem {
	id: number;
	name: string;
	coordinator_count: number;
	exam_centres: Array<{
		id: number;
		name: string;
		type: string;
		gender: string;
		
	coordinators: Array<{
			id: number;
			name: string;
			contact: Array<string>;
		}>;
	}>;
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
						if (d.exam_centres.length === 0) return null;
						return (
							<section className="my-4">
								<div className="flex gap-1.5 items-center mb-2">
									<h2 key={d.id} className="text-xl font-semibold">
										{d.name}
									</h2>
									-
									<span>{d.exam_centres.length} Centres</span>
									-
									<span>{d.coordinator_count} Coordinators</span>
								</div>

								<div className="grid grid-cols-[auto_1fr_auto_auto_1fr] overview-table">
									<div className="contents">
										<span className="font-bold">Id</span>
										<span className="font-bold">Name</span>
										<span className="font-bold">
											Gender
										</span>
										<span className="font-bold">
											Type
										</span>
										<span className="font-bold">Coordinators</span>
									</div>

									{d.exam_centres.map((centre) => (
										<div key={centre.id} className="contents">
											<span className="py-1">{centre.id}</span>
											<span>{centre.name}</span>
											<span>
												{centre.gender}
											</span>
											<span>
												{capitalize(centre.type)}
											</span>
											<span>

											<ul className="pl-0">
												{centre.coordinators
													.map(
														(c) =>
															<li>
															{c.name} ({c.contact.join(
																", ",
															)})
															</li>
													)
												}
											</ul>
											</span>
										</div>
									))}
								</div>
							</section>
						);
					})
				)}
			</main>
		</>
	);
}
