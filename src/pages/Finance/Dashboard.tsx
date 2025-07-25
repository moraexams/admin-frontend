import { PlusCircle } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	Cell,
	Label,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import SummaryCard from "../../components/Cards/FinanceSummaryCard";
import DefaultLayout from "../../layout/DefaultLayout";
import { getFinanceStats } from "../../services/financeServices";
import type { FinanceStats } from "../../types/finance";
import { getDistrictNameById } from "./mockData";

const FinanceDashboard: React.FC = () => {
	const [financeStats, setFinanceStats] = useState<
		FinanceStats["stats"] | null
	>(null);

	useEffect(() => {
		getFinanceStats().then((data) => {
			if (!data) return;
			setFinanceStats(data.stats);
		});
	}, []);

	let total = 0;
	// Prepare Pie Chart Data
	const expenseData =
		financeStats === null || financeStats.expense_category_breakdown === null
			? []
			: financeStats.expense_category_breakdown.map((item) => {
					total += item.amount;

					return {
						name: item.category,
						value: item.amount,
					};
				});

	const pieColors = ["#81c784", "#64b5f6", "#ffb74d", "#e1bee7", "#80deea"];

	console.log(financeStats);
	if (financeStats == null) {
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
							<Link
								className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								to="/finance/add-transaction"
							>
								<PlusCircle size={18} className="mr-2" />
								New Transaction
							</Link>
						</div>
					</div>
				</div>
			</DefaultLayout>
		);
	}

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
						<Link
							className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							to="/finance/add-transaction"
						>
							<PlusCircle size={18} className="mr-2" />
							New Transaction
						</Link>
					</div>
				</div>

				{/* Summary Cards + Donut Chart */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
					{/* Summary Cards */}
					<div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<SummaryCard
								title="Bank Balance"
								value={
									financeStats == null ? 0 : financeStats.current_balance.bank
								}
							/>
							<SummaryCard
								title="Cash Balance"
								value={
									financeStats == null ? 0 : financeStats.current_balance.cash
								}
							/>
							<SummaryCard
								title="Total Income"
								value={financeStats == null ? 0 : financeStats.total_income}
							/>
							<SummaryCard
								title="Total Expenses"
								value={financeStats == null ? 0 : financeStats.total_expenses}
							/>
							<Link to="/finance/districts">
								<SummaryCard
									title="District Expenses"
									value={financeStats?.out_district_expense_total ?? 0}
								/>
							</Link>
						</div>
					</div>

					{/* Donut Chart */}
					{expenseData.length === 0 ? null : (
						<div className="bg-white p-6 rounded-lg shadow dark:bg-boxdark">
							<h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
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
										{pieColors.map((color) => (
											<Cell key={color} fill={color} />
										))}
										<Label
											value={`LKR ${total.toLocaleString("en-LK")}`}
											position="center"
											style={{
												fill: "currentColor",
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
					)}
				</div>

				{/* Last 5 Transactions */}
				{financeStats.recent_transactions === null ||
				financeStats.recent_transactions.length === 0 ? null : (
					<div className="bg-white p-6 rounded-lg shadow mt-10 dark:bg-boxdark dark:text-white">
						<h2 className="text-xl font-bold mb-4 text-gray-800">
							Last 5 Transactions
						</h2>
						<ul className="space-y-4">
							{financeStats.recent_transactions.map((txn) => (
								<li
									key={txn.id}
									className="py-3 px-4 rounded-md bg-white hover:shadow-md hover:bg-blue-50 transition duration-150 ease-in-out cursor-pointer dark:bg-boxdark dark:hover:bg-meta-4 dark:text-white"
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
													txn.type === "income" ? "bg-green-500" : "bg-red-500"
												}`}
											/>
											<span className="font-medium">
												{new Date(txn.created_at).toLocaleDateString("en-US", {
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
													{new Date(txn.created_at).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "2-digit",
														},
													)}
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
				)}
			</div>
		</DefaultLayout>
	);
};

export default FinanceDashboard;
