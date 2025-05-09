import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DistrictExpensesTable from "../../components/Tables/DistrictExpenseTable";
import DefaultLayout from "../../layout/DefaultLayout";
import { getDistricts } from "../../services/districtService";

const DistrictExpenses = () => {
	const [districts, setDistricts] = useState<{ name: string }[]>([]);
	useEffect(() => {
		const fetchDistricts = async () => {
			try {
				const districts = await getDistricts();
				setDistricts(districts);
			} catch (error) {
				setError("Failed to fetch districts");
			} finally {
				setLoading(false);
			}
		};

		fetchDistricts();
	}, []);

	return (
		<DefaultLayout>
			<Breadcrumb pageName="District Expenses" />
			<DistrictExpensesTable
				data={districts.map((district, index) => ({
					id: index + 1,
					district: district.name, // Assuming each district object has a 'name' property
					expense: Math.floor(Math.random() * 10000), // Replace with actual expense data
					pending: Math.floor(Math.random() * 5000), // Replace with actual pending data
				}))}
			/>
		</DefaultLayout>
	);
};

export default DistrictExpenses;
function setError(_arg0: string) {
	throw new Error("Function not implemented.");
}

function setLoading(_arg0: boolean) {
	throw new Error("Function not implemented.");
}
