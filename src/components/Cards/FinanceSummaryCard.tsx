import { Card } from "@/components/ui/card";
import type React from "react";
import { CurrencyFormatter } from "../../services/utils";

interface SummaryCardProps {
	title: string;
	value: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => {
	return (
		<Card className="rounded-xl shadow-xs p-6 transition-all hover:shadow-md">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-sm font-medium mb-1">{title}</h3>
					<p className="text-2xl font-bold">
						{CurrencyFormatter.format(value)}
					</p>
				</div>
			</div>
		</Card>
	);
};

export default SummaryCard;
