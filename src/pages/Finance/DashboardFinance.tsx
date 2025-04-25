import { Activity, PlusCircle, TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";
import { useState } from "react";
import SummaryCard from "../../components/Cards/FinanceSummaryCard";
import DefaultLayout from "../../layout/DefaultLayout";

import { getBalance, getTotalExpenses, getTotalIncome } from "./mockData";

const DashboardFinance: React.FC = () => {
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
				</div>
			</div>
		</DefaultLayout>
	);
};

export default DashboardFinance;
