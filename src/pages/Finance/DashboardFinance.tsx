import { Activity, PlusCircle, TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import SummaryCard from "../../components/Cards/FinanceSummaryCard";
import DefaultLayout from "../../layout/DefaultLayout";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { getFinanceStats } from "../../services/financeServices";
import {
	getDistrictNameById,
	getRecentTransactions,
	getTotalDistrictExpenses,
	getTotalExpenses,
} from "./mockData";

interface FinanceStats {
	stats: {
		current_balance: number;
		total_income: number;
		total_expenses: number;
	};
}

const DashboardFinance: React.FC = () => {
<<<<<<< HEAD
	
	const [, setIsTransactionFormOpen] = useState(false);
=======
	const navigate = useNavigate();
>>>>>>> 9e340ca8ede45e970de5388c500e6c5683156bc6
	const lastTransactions = getRecentTransactions();
	const [financeStats, setFinanceStats] = useState<FinanceStats | null>(null);
	
  useEffect(() => {
    getFinanceStats().then((data) => {
      setFinanceStats(data);
    });
  }, []);

<<<<<<< HEAD
	function getDistrictNameById(districtId: string): React.ReactNode {
		return null
	}

	return (
		<DefaultLayout>
			<div className="py-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
						<p className="text-gray-600 mt-1">
							Welcome back to your financial overview
						</p>
					</div>
=======
  // Prepare Pie Chart Data
  const expenseData: { name: string; value: number }[] =
    getRecentTransactions()
      .filter((txn) => txn.type === "expense")
      .reduce<{ name: string; value: number }[]>((acc, txn) => {
        const found = acc.find((item) => item.name === txn.category);
        if (found) {
          found.value += txn.amount;
        } else {
          acc.push({ name: txn.category, value: txn.amount });
        }
        return acc;
      }, []);
>>>>>>> 9e340ca8ede45e970de5388c500e6c5683156bc6

  const pieColors = ["#81c784", "#64b5f6", "#ffb74d", "#e1bee7", "#80deea"];

<<<<<<< HEAD
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<SummaryCard
						title="Total Balance"
						value={getBalance()}
						change={8}
						type="neutral"
						icon={<Activity size={20} />}
					/>
					<SummaryCard
						title="Total Income"
						value={getTotalIncome()}
						change={12}
						type="positive"
						icon={<TrendingUp size={20} />}
					/>
					<SummaryCard
						title="Total Expenses"
						value={getTotalExpenses()}
						change={5}
						type="negative"
						icon={<TrendingDown size={20} />}
					/>
			
					{/* <div
						className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
						onClick={() => navigate("/Finance")} 
					>
						<h2 className="text-lg font-bold text-gray-900 mb-4">Districts</h2>
						<div className="flex justify-between items-center mb-2">
							<span className="text-gray-600">Total Budget</span>
							<span className="text-gray-900 font-semibold">{getTotalDistrictsBudget()}</span>
						</div>
						<div className="flex justgit@github.com:moraexams/backend.gitify-between items-center">
							<span className="text-gray-600">Total Expenses</span>
							<span className="text-gray-900 font-semibold">{getTotalDistrictsExpenses()}</span>
						</div>
					</div> */}
					
				</div>
=======
  return (
    <DefaultLayout>
      <div className="py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back to your financial overview
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              type="button"
              onClick={() => navigate("/finance/add_finance")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle size={18} className="mr-2" />
              New Transaction
            </button>
          </div>
        </div>
>>>>>>> 9e340ca8ede45e970de5388c500e6c5683156bc6

        {/* Summary Cards + Donut Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Summary Cards */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SummaryCard
                title="Total Balance"
                value={financeStats == null ? 0 : financeStats.stats.current_balance}
                change={8}
                type="neutral"
                icon={<Activity size={20} />}
              />
              <SummaryCard
                title="Total Income"
                value={financeStats == null ? 0 : financeStats.stats.total_income}
                change={12}
                type="positive"
                icon={<TrendingUp size={20} />}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
              <SummaryCard
                title="Total Expenses"
                value={financeStats == null ? 0 : financeStats.stats.total_expenses}
                change={5}
                type="negative"
                icon={<TrendingDown size={20} />}
              />
              <SummaryCard
                title="District Expenses"
                value={getTotalDistrictExpenses()}
                change={0}
                type="negative"
                icon={<TrendingDown size={20} />}
              />
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Expense Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {pieColors.map((color, index) => (
                    <Cell key={index} fill={color} />
                  ))}
                  <Label
                    value={`All\nLKR ${getTotalExpenses().toLocaleString("en-LK")}`}
                    position="center"
                    style={{
                      fill: "#333",
                      fontSize: "16px",
                      fontWeight: "bold",
                      textAlign: "center",
                      whiteSpace: "pre-line",
                    }}
                  />
                </Pie>
                <Tooltip />
                <Legend
                  iconType="circle"
                  layout="horizontal"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Last 5 Transactions */}
        <div className="bg-white p-6 rounded-lg shadow mt-10">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Last 5 Transactions
          </h2>
          <ul className="space-y-4">
            {lastTransactions.map((txn) => (
              <li
                key={txn.id}
                className="py-3 px-4 rounded-md bg-white hover:shadow-md hover:bg-blue-50 transition duration-150 ease-in-out cursor-pointer"
              >
                {/* Desktop layout */}
                <div
                  className="hidden sm:grid items-center gap-4"
                  style={{ gridTemplateColumns: "110px 1fr 140px 100px" }}
                >
                  {/* Date with Dot */}
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        txn.type === "income"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="font-medium">
                      {new Date(txn.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="truncate font-semibold text-gray-700">
                    {txn.description}
                  </div>

                  {/* District */}
                  <div className="text-sm text-gray-600">
                    {getDistrictNameById(txn.districtId)}
                  </div>

                  {/* Amount */}
                  <div
                    className={`text-right font-bold ${
                      txn.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {txn.type === "income" ? "+" : "-"}$
                    {txn.amount.toFixed(2)}
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="sm:hidden flex flex-col space-y-1 text-sm">
                  <div className="flex items-center justify-between text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          txn.type === "income"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="font-medium">
                        {new Date(txn.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                        })}
                      </span>
                    </div>
                    <div
                      className={`font-bold ${
                        txn.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {txn.type === "income" ? "+" : "-"}$
                      {txn.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-gray-700 font-semibold">
                    {txn.description}
                  </div>
                  <div className="text-gray-500">
                    {getDistrictNameById(txn.districtId)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DashboardFinance;
