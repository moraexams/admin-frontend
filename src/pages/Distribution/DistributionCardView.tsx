import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import ExamPaperDistributionCard from "../../components/Cards/ExamPaperDistributionCard";
import DefaultLayout from "../../layout/DefaultLayout";
import { getDistributions } from "../../services/distributionService";
import type { District } from "../../types/types";

const ExamPaperDistributionCardView = () => {
	const [districts, setDistricts] = useState<District[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [district, setDistrict] = useState<number>(1);
	const [centre, setCentre] = useState<number>(-1);

	const handleDistrictSelect = (districtId: number) => {
		setDistrict(districtId);
		setCentre(-1);
	};
	useEffect(() => {
		const fetchDistricts = async () => {
			try {
				const districts = await getDistributions();
				setDistricts(districts);
			} catch (error) {
				setError("Failed to fetch districts");
			} finally {
				setLoading(false);
			}
		};

		fetchDistricts();
	}, []);
	if (error) {
		return <div>{error}</div>;
	}
	return (
		<DefaultLayout>
			<Breadcrumb pageName="Exam Paper Distribution Card View" />
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
						<option value="-1">All</option>
						{districts
							.find((d) => d.id === district)
							?.exam_centres?.map((centre) => (
								<option key={centre.id} value={centre.id}>
									{centre.name}
								</option>
							))}
					</select>
				</div>
			</div>
			<div className="flex flex-col gap-10">
				{loading ? (
					<div>Loading...</div>
				) : (
					<ExamPaperDistributionCard
						districtData={districts}
						district={district}
						centre={centre}
					/>
				)}
			</div>
		</DefaultLayout>
	);
};

export default ExamPaperDistributionCardView;
