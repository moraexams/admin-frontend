import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import CoordinatorsTable from "../../components/Tables/CoordinatorsTable";
import DefaultLayout from "../../layout/DefaultLayout";
import { getDistrictsWithCoordinators } from "../../services/districtService";
import type { District } from "../../types/types";

const Coordinators = () => {
	const [districts, setDistricts] = useState<District[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);
	const [searchKey, setSearchKey] = useState<string>("");

	const [refreshKey, setRefreshKey] = useState(0); // State to trigger refresh

	useEffect(() => {
		const fetchDistricts = async () => {
			try {
				const districts = await getDistrictsWithCoordinators();
				setDistricts(districts);
			} catch (error) {
				setError("Failed to fetch districts");
			} finally {
				setLoading(false);
			}
		};

		fetchDistricts();
	}, [refreshKey]);
	if (error) {
		return <div>{error}</div>;
	}
	return (
		<DefaultLayout>
			<Breadcrumb pageName="Coordinators" />

			<div className="flex gap-4">
				<div className="mb-5.5">
					<select
						className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
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
				</div>
				<div className="mb-4.5">
					<input
						type="text"
						value={searchKey}
						onChange={(e) => setSearchKey(e.target.value)}
						placeholder="Search..."
						className="w-full rounded border-[1.5px] border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
					/>
				</div>
			</div>
			<div className="flex flex-col gap-10">
				{loading ? (
					<div>Loading...</div>
				) : (
					<CoordinatorsTable
						districtData={districts}
						searchKey={searchKey}
						itemsPerPage={itemsPerPage}
						setRefreshKey={setRefreshKey}
					/>
				)}
			</div>
		</DefaultLayout>
	);
};

export default Coordinators;
