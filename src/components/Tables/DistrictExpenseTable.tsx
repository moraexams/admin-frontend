import { useMemo, useState } from "react";

interface DISTRICT_EXPENSE {
	id: number;
	district: string;
	expense: number;
	pending: number;
}

interface DistrictExpensesTableProps {
	data: DISTRICT_EXPENSE[];
}

const DistrictExpensesTable = ({ data }: DistrictExpensesTableProps) => {
	const [sortConfig, setSortConfig] = useState<{
		key: keyof DISTRICT_EXPENSE;
		direction: "asc" | "desc";
	} | null>(null);

	const handleSort = (key: keyof DISTRICT_EXPENSE) => {
		let direction: "asc" | "desc" = "asc";
		if (sortConfig?.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const sortedData = useMemo(() => {
		if (!sortConfig) return data;
		const sorted = [...data].sort((a, b) => {
			if (a[sortConfig.key] < b[sortConfig.key])
				return sortConfig.direction === "asc" ? -1 : 1;
			if (a[sortConfig.key] > b[sortConfig.key])
				return sortConfig.direction === "asc" ? 1 : -1;
			return 0;
		});
		return sorted;
	}, [data, sortConfig]);

	const getArrow = (key: keyof DISTRICT_EXPENSE) => {
		if (sortConfig?.key !== key) return "↕";
		return sortConfig.direction === "asc" ? "↑" : "↓";
	};

	return (
		<div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
			<div className="flex flex-col">
				<div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4">
					<div
						className="p-2.5 xl:p-5 cursor-pointer select-none"
						onClick={() => handleSort("id")}
					>
						<h5 className="text-sm font-bold uppercase xsm:text-base flex items-center gap-1">
							ID <span className="text-xs">{getArrow("id")}</span>
						</h5>
					</div>
					<div
						className="p-2.5 xl:p-5 cursor-pointer select-none"
						onClick={() => handleSort("district")}
					>
						<h5 className="text-sm font-bold uppercase xsm:text-base flex items-center gap-1">
							District <span className="text-xs">{getArrow("district")}</span>
						</h5>
					</div>
					<div
						className="p-2.5 xl:p-5 cursor-pointer select-none"
						onClick={() => handleSort("expense")}
					>
						<h5 className="text-sm font-bold uppercase xsm:text-base flex items-center gap-1">
							Expense <span className="text-xs">{getArrow("expense")}</span>
						</h5>
					</div>
					<div
						className="p-2.5 xl:p-5 cursor-pointer select-none"
						onClick={() => handleSort("pending")}
					>
						<h5 className="text-sm font-bold uppercase xsm:text-base flex items-center gap-1">
							Income <span className="text-xs">{getArrow("pending")}</span>
						</h5>
					</div>
				</div>

				{sortedData.map((row, key) => (
					<div
						className={`grid grid-cols-4 ${
							key === data.length - 1
								? ""
								: "border-b border-stroke dark:border-strokedark"
						}`}
						key={row.id}
					>
						<div className="flex items-center p-2.5 xl:p-5">
							<p className="text-black dark:text-white">{row.id}</p>
						</div>
						<div className="flex items-center p-2.5 xl:p-5">
							<p className="text-black dark:text-white">{row.district}</p>
						</div>
						<div className="flex items-center p-2.5 xl:p-5">
							<p className="text-meta-3">{row.expense}</p>
						</div>
						<div className="flex items-center p-2.5 xl:p-5">
							<p className="text-meta-5">{row.pending}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default DistrictExpensesTable;
