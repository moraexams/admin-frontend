import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";

const chartConfig = {
	entered: {
		label: "Entered",
		color: "var(--chart-1)",
	},
	verified: {
		label: "Verified",
		color: "var(--chart-2)",
	},
	remaining: {
		label: "Remaining",
		color: "var(--chart-3)",
	},
} satisfies ChartConfig;

interface PartData {
	total_entered: number;
	total_verified: number;
}

interface Subject {
	subject_id: number;
	subject: string;
	total_count: number;
	part1: PartData;
	part2: PartData;
}

interface Props {
	stats: {
		subjects: Subject[];
	};
}

export function OverallMarksStatsCard({ stats }: Props) {
	const getChartData = (part: PartData, total: number) => {
		const remaining = Math.max(
			total - (part.total_entered + part.total_verified),
			0,
		);
		return [
			{ name: "Entered", value: part.total_entered, fill: "var(--chart-1)" },
			{ name: "Verified", value: part.total_verified, fill: "var(--chart-2)" },
			{ name: "Remaining", value: remaining, fill: "var(--chart-3)" },
		];
	};

	return (
		<>
			<h2 className="text-xl font-bold mb-5">Subject Statistics</h2>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
				{stats.subjects.map((s) => (
					<Card className="flex flex-col" key={s.subject_id}>
						<CardHeader className="items-center pb-0">
							<CardTitle>
								{s.subject} ({s.total_count.toLocaleString()})
							</CardTitle>
						</CardHeader>

						<CardContent className="flex-1 pb-0 grid grid-cols-2 grid-rows-[auto_1fr] min-h-[250px]">
							{/* ==== PART 1 ==== */}
							<h3 className="text-lg font-medium justify-self-center w-fit">
								Part 1
							</h3>
							<ChartContainer
								config={chartConfig}
								className="mx-auto aspect-square max-h-[250px] h-full"
							>
								<PieChart>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent hideLabel />}
									/>
									<Pie
										data={getChartData(s.part1, s.total_count)}
										dataKey="value"
										nameKey="name"
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
																className="fill-foreground text-2xl font-bold"
															>
																{s.part1.total_entered + s.part1.total_verified}
															</tspan>
															<tspan
																x={viewBox.cx}
																y={(viewBox.cy || 0) + 20}
																className="fill-muted-foreground text-sm"
															>
																/{s.total_count}
															</tspan>
														</text>
													);
												}
											}}
										/>
									</Pie>
								</PieChart>
							</ChartContainer>

							{/* ==== PART 2 ==== */}
							<h3 className="text-lg font-medium justify-self-center w-fit col-start-2 row-start-1">
								Part 2
							</h3>
							<ChartContainer
								config={chartConfig}
								className="mx-auto aspect-square max-h-[250px] h-full"
							>
								<PieChart>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent hideLabel />}
									/>
									<Pie
										data={getChartData(s.part2, s.total_count)}
										dataKey="value"
										nameKey="name"
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
																className="fill-foreground text-2xl font-bold"
															>
																{s.part2.total_entered + s.part2.total_verified}
															</tspan>
															<tspan
																x={viewBox.cx}
																y={(viewBox.cy || 0) + 20}
																className="fill-muted-foreground text-sm"
															>
																/{s.total_count}
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
					</Card>
				))}
			</div>
		</>
	);
}
