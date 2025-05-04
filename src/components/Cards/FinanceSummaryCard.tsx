import { ArrowDownRight, ArrowUpRight, DollarSign } from "lucide-react";
import type React from "react";

interface SummaryCardProps {
	title: string;
	value: number;
	change?: number;
	type?: "neutral" | "positive" | "negative";
	icon?: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
	title,
	value,
	change = 0,
	type = "neutral",
	icon = <DollarSign size={20} />,
}) => {
	const formatCurrency = (amount: number) => {
		const absFormatted = new Intl.NumberFormat("en-LK", {
		  style: "currency",
		  currency: "LKR",
		  minimumFractionDigits: 0,
		  maximumFractionDigits: 0,
		})
		  .format(Math.abs(amount)) 
		  .replace("LKR", "") 
	  
		return `LKR ${amount < 0 ? "-" : ""}${absFormatted.trim()}`; // Add the negative sign before the value if needed
	  };
	  

	const getChangeColor = () => {
		if (type === "positive") return "text-green-600 bg-green-50";
		if (type === "negative") return "text-red-600 bg-red-50";
		return "text-blue-600 bg-blue-50";
	};

	const getChangeIcon = () => {
		if (type === "positive" || change > 0) return <ArrowUpRight size={14} />;
		if (type === "negative" || change < 0) return <ArrowDownRight size={14} />;
		return null;
	};

	return (
		<div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md min-h-[180px]">
	
			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-gray-500 text-sm font-medium mb-5">{title}</h3>
					<p className="text-2xl font-bold text-gray-900">
						{formatCurrency(value)}
					</p>
				</div>
				<div
					className={`p-3 rounded-full ${type === "positive" ? "bg-green-100 text-green-600" : type === "negative" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
				>
					{icon}
				</div>
			</div>

			{change !== 0 && (
				<div className="mt-4 flex items-center">
					<div
						className={`flex items-center px-2 py-1 rounded ${getChangeColor()}`}
					>
						{getChangeIcon()}
						<span className="ml-1 text-xs font-medium">
							{Math.abs(change)}%
						</span>
					</div>
					<span className="text-gray-500 text-xs ml-2">from last month</span>
				</div>
			)}
		</div>
	);
};

export default SummaryCard;
