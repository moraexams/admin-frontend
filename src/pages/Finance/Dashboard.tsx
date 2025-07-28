import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { PlusCircle } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Label, Pie, PieChart } from "recharts";
import SummaryCard from "../../components/Cards/FinanceSummaryCard";
import { getFinanceStats } from "../../services/financeServices";
import { CurrencyFormatter } from "../../services/utils";
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

	const [totalExpense, expenseChartConfig, expenseChartData] = useMemo(() => {
		let total = 0;
		const config: ChartConfig = {};
		const chartData: Array<{ category: string; amount: number; fill: string }> =
			[];

		if (
			financeStats == null ||
			financeStats.expense_category_breakdown == null
		) {
			return [0, config, chartData];
		}

		for (let i = 0; i < financeStats.expense_category_breakdown.length; i++) {
			const item = financeStats.expense_category_breakdown[i];
			total += item.amount;
			config[item.category.toLowerCase()] = {
				label: item.category,
				color: `var(--chart-${(i % 5) + 1})`, // pieColors[i % pieColors.length],
			};
			chartData.push({
				category: item.category.toLowerCase(),
				amount: item.amount,
				fill: `var(--color-${item.category.toLowerCase()})`, // Use a color mapping if available
			});
		}
		return [total, config, chartData];
	}, [financeStats?.expense_category_breakdown]);

	if (financeStats == null) {
		return (
			<div className="py-6">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold">Dashboard</h1>
						<p className="mt-1">Welcome back to your financial overview</p>
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
		);
	}

	return (
		<>
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold">Dashboard</h1>
					<p className="mt-1">Welcome back to your financial overview</p>
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
				{totalExpense === 0 ? null : (
					<Card className="flex flex-col">
						<CardHeader className="items-center pb-0">
							<CardTitle>Expense Breakdown</CardTitle>
						</CardHeader>
						<CardContent className="flex-1 pb-0">
							<ChartContainer
								config={expenseChartConfig}
								className="mx-auto aspect-square max-h-[250px]"
							>
								<PieChart>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent hideLabel />}
									/>
									<Pie
										data={expenseChartData}
										dataKey="amount"
										nameKey="category"
										innerRadius={60}
										strokeWidth={5}
									>
										<Label
											content={({ viewBox }) => {
												if (viewBox && "cx" in viewBox && "cy" in viewBox) {
													return (
														<text
															x={viewBox.cx}
															y={viewBox.cy}
															textAnchor="middle"
															dominantBaseline="middle"
														>
															<tspan
																x={viewBox.cx}
																y={viewBox.cy}
																className="fill-foreground text-3xl font-bold"
															>
																{totalExpense.toLocaleString()}
															</tspan>
															<tspan
																x={viewBox.cx}
																y={(viewBox.cy || 0) + 24}
																className="fill-muted-foreground"
															>
																Visitors
															</tspan>
														</text>
													);
												}
											}}
										/>
									</Pie>
								</PieChart>
							</ChartContainer>
						</CardContent>
						<CardFooter className="flex-col gap-2 text-sm">
							<div className="text-muted-foreground leading-none">
								Showing all expenses by category
							</div>
						</CardFooter>
					</Card>
				)}
			</div>

			{/* Last 5 Transactions */}
			{financeStats.recent_transactions === null ||
			financeStats.recent_transactions.length === 0 ? null : (
				<Card className="p-6 rounded-lg shadow-sm">
					<h2 className="text-xl font-bold mb-4">Last 5 Transactions</h2>
					<ul className="space-y-4">
						{financeStats.recent_transactions.map((txn) => (
							<li
								key={txn.id}
								className="py-3 px-4 rounded-md hover:shadow-md transition duration-150 ease-in-out cursor-pointer bg-accent hover:bg-accent/80"
							>
								{/* Desktop layout */}
								<div
									className="hidden sm:grid items-center gap-4"
									style={{ gridTemplateColumns: "auto 1fr auto auto" }}
								>
									{/* Date with Dot */}
									<div className="flex items-center space-x-2 text-sm">
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
									<div className="truncate font-semibold">
										{txn.description}
									</div>

									{/* District */}
									<div className="text-sm">
										{getDistrictNameById(txn.districtId)}
									</div>

									{/* Amount */}
									<div
										className={`text-right font-bold ${
											txn.type === "income" ? "text-green-600" : "text-red-600"
										}`}
									>
										{txn.type === "income" ? "+" : "-"}
										{CurrencyFormatter.format(txn.amount)}
									</div>
								</div>

								{/* Mobile layout */}
								<div className="sm:hidden flex flex-col space-y-1 text-sm">
									<div className="flex items-center justify-between text-gray-500">
										<div className="flex items-center space-x-2">
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
				</Card>
			)}
		</>
	);
};

export default FinanceDashboard;
