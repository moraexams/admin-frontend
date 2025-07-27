import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DistrictExpensesTable from "../../components/Tables/DistrictExpenseTable";
import { getDistrictFinanceStats } from "../../services/financeServices";

const DistrictsSummary = () => {
	const [districtStats, setDistrictStats] = useState<
		Array<{
			district: string;
			budget: number;
			expense: number;
			paid: number;
		}>
	>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const data = await getDistrictFinanceStats();
				console.log(data);
				setDistrictStats(data);
			} catch (err) {
				setError("Failed to fetch district finance stats");
			} finally {
				setLoading(false);
			}
		};
		fetchStats();
	}, []);

	return (
		<>
			<Breadcrumb
				pageName="District Summary"
				dashboardPath="/finance/dashboard"
			/>

			{loading ? (
				<p>Loading...</p>
			) : error ? (
				<p className="text-red-500">{error}</p>
			) : districtStats.length === 0 ? (
				<p>Add transactions to view district expenses.</p>
			) : (
				<DistrictExpensesTable
					data={districtStats.map((d, index) => ({
						id: index + 1,
						district: d.district,
						budget: d.budget,
						expense: d.expense,
						paid: d.paid,
						pending: d.budget - d.paid,
					}))}
				/>
			)}
		</>
	);
};

export default DistrictsSummary;
