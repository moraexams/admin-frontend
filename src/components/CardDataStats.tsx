import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";

interface CardDataStatsProps {
	title: string;
	total: number;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({ title, total }) => {
	return (
		<Card className="gap-0 py-4">
			<CardHeader className="px-4">
				<CardTitle className="text-sm">{title}</CardTitle>
			</CardHeader>
			<CardContent className="px-4">
				<div className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
					{total}
				</div>
			</CardContent>
		</Card>
	);
};

export default CardDataStats;
