import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DistrictExpensesTable from "../../components/Tables/DistrictExpenseTable";
import DefaultLayout from "../../layout/DefaultLayout";
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
    <DefaultLayout>
      <Breadcrumb pageName="District Summary" dashboardPath="/finance/dashboard" />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
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
    </DefaultLayout>
  );
};

export default DistrictsSummary;
