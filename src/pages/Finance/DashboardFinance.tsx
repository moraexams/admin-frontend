import { Activity, PlusCircle, TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";
import { useState } from "react";
import SummaryCard from "../../components/Cards/FinanceSummaryCard";
import DefaultLayout from "../../layout/DefaultLayout";

import {
	getBalance,
	getDistrictNameById,
	getRecentTransactions,
	getTotalExpenses,
	getTotalIncome,
} from "./mockData";

const DashboardFinance: React.FC = () => {
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
				</div>

				{/* Last 5 Transactions */}
				<div className="bg-white p-6 rounded-lg shadow max-w-3xl ml-0">
					<h2 className="text-xl font-bold mb-4 text-gray-800">
						Last 5 Transactions
					</h2>
					<ul className="space-y-4">
						{lastTransactions.map((txn) => (
							<li
								key={txn.id}
								className="py-2 transition-transform transform hover:scale-[1.02] hover:shadow-md rounded-lg px-4 bg-white"
							>
								{/* Desktop layout */}
								<div
									className="hidden sm:grid items-center gap-4"
									style={{ gridTemplateColumns: "100px 1fr 150px 100px" }}
								>
									{/* Date with Dot */}
									<div className="flex items-center space-x-2 text-sm text-gray-500">
										<span
											className={`w-2.5 h-2.5 rounded-full ${
												txn.type === "income" ? "bg-green-500" : "bg-red-500"
											}`}
										/>
										<span>
											{new Date(txn.date).toLocaleDateString("en-US", {
												month: "short",
												day: "2-digit",
											})}
										</span>
									</div>

									{/* Description */}
									<div className="truncate text-gray-700 font-medium">
										{txn.description}
									</div>

									{/* District */}
									<div className="text-sm text-gray-600 whitespace-nowrap">
										{getDistrictNameById(txn.districtId)}
									</div>

									{/* Amount */}
									<div
										className={`text-right font-bold ${
											txn.type === "income"
												? "text-green-500"
												: "text-red-500"
										}`}
									>
										{txn.type === "income" ? "+" : "-"}${txn.amount}
									</div>
								</div>

								{/* Mobile layout */}
								<div className="sm:hidden flex flex-col space-y-1 text-sm">
									<div className="flex items-center justify-between text-gray-500">
										<div className="flex items-center space-x-2">
											<span
												className={`w-2.5 h-2.5 rounded-full ${
													txn.type === "income"
														? "bg-green-500"
														: "bg-red-500"
												}`}
											/>
											<span>
												{new Date(txn.date).toLocaleDateString("en-US", {
													month: "short",
													day: "2-digit",
												})}
											</span>
										</div>
										<div
											className={`font-bold ${
												txn.type === "income"
													? "text-green-500"
													: "text-red-500"
											}`}
										>
											{txn.type === "income" ? "+" : "-"}${txn.amount}
										</div>
									</div>
									<div className="text-gray-700 font-medium">
										{txn.description}
									</div>
									<div className="text-gray-600">
										{getDistrictNameById(txn.districtId)}
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