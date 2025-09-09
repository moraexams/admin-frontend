import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type React from "react";
import { NavLink } from "react-router-dom";

interface CardDataStatsProps {
	title: string;
	total: number;
	link?: string;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
	title,
	total,
	link,
}) => {
	const content = (
		<Card className="gap-0 py-4">
			<CardHeader className="px-4">
				<CardTitle className="text-sm flex justify-between items-center">
					<span>{title}</span>
					<span>
						{link === undefined ? null : (
							<ArrowRight className="-translate-x-2 group-hover:translate-x-0 transition-transform ease-in-out" />
						)}
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4">
				<div className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
					{total}
				</div>
			</CardContent>
		</Card>
	);

	if (link) {
		return (
			<NavLink to={link} className="group">
				{content}
			</NavLink>
		);
	}
	return content;
};

export default CardDataStats;
