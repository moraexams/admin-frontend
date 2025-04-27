import { Activity, PlusCircle, TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";
import { useState } from "react";
import SummaryCard from "../../components/Cards/FinanceSummaryCard";
import DefaultLayout from "../../layout/DefaultLayout";
import { useNavigate } from "react-router-dom";

import { getBalance, getTotalExpenses, getTotalIncome } from "./mockData";

const DashboardFinance: React.FC = () => {
	const navigate = useNavigate();
	const [, setIsTransactionFormOpen] = useState(false);
	const lastTransactions = getRecentTransactions();

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

				{/* Last 5 Transactions */}
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-bold mb-4 text-gray-800">
						Last 5 Transactions
					</h2>
					<ul className="space-y-4">
						{lastTransactions.map((txn) => (
							<li
								key={txn.id}
								className="py-4 transition-transform transform hover:scale-[1.02] hover:shadow-md rounded-lg px-4 bg-white"
							>
								<div className="grid grid-cols-4 items-start gap-4">
									{/* Description */}
									<div className="text-gray-700 font-medium">
										{txn.description}
									</div>

									{/* Date with Dot */}
									<div className="flex items-center space-x-2 text-sm text-gray-500">
										<span
											className={`w-2.5 h-2.5 rounded-full ${
												txn.type === "income" ? "bg-green-500" : "bg-red-500"
											}`}
										/>
										<span>{txn.date}</span>
									</div>

									{/* District */}
									<div className="text-sm text-gray-600">
										{getDistrictNameById(txn.districtId)}
									</div>

									{/* Amount with Type below */}
									<div className="flex flex-col items-end">
										<p
											className={`font-bold ${
												txn.type === "income"
													? "text-green-500"
													: "text-red-500"
											}`}
										>
											{txn.type === "income" ? "+" : "-"}${txn.amount}
										</p>
										<p className="text-xs text-gray-400">
											{txn.type.toUpperCase()}
										</p>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
				{/* End Transactions */}
			</div>
		</DefaultLayout>
	);
};

export default DashboardFinance;
