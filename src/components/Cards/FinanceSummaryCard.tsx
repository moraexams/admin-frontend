import type React from "react";
import { CurrencyFormatter } from "../../services/utils";

interface SummaryCardProps {
	title: string;
	value: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => {
	return (
		<div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md dark:bg-boxdark dark:text-white">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-gray-500 text-sm font-medium mb-5">{title}</h3>
					<p className="text-2xl font-bold text-gray-900">
						{CurrencyFormatter.format(value)}
					</p>
				</div>
			</div>
		</div>
	);
};

export default SummaryCard;
