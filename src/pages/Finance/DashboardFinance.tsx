import { Activity, PlusCircle, TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";
import { useState } from "react";
import SummaryCard from "../../components/Cards/FinanceSummaryCard";
import DefaultLayout from "../../layout/DefaultLayout";
import { useNavigate } from "react-router-dom";

import { getBalance, getTotalDistrictsBudget, getTotalDistrictsExpenses, getTotalExpenses, getTotalIncome } from "./mockData";

const DashboardFinance: React.FC = () => {
	const navigate = useNavigate();
	const [, setIsTransactionFormOpen] = useState(false);

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

					<div className="mt-4 md:mt-0">
						<button
							type="button"
							onClick={() => setIsTransactionFormOpen(true)}
							className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<PlusCircle size={18} className="mr-2" />
							New Transaction
						</button>
					</div>
				</div>

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
			
					<div
						className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
						onClick={() => navigate("/Finance")} 
					>
						<h2 className="text-lg font-bold text-gray-900 mb-4">Districts</h2>
						<div className="flex justify-between items-center mb-2">
							<span className="text-gray-600">Total Budget</span>
							<span className="text-gray-900 font-semibold">{getTotalDistrictsBudget()}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-600">Total Expenses</span>
							<span className="text-gray-900 font-semibold">{getTotalDistrictsExpenses()}</span>
						</div>
					</div>
					
				</div>
			</div>
		</DefaultLayout>
	);
};

export default DashboardFinance;
