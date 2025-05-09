import { Banknote, Landmark } from "lucide-react";
import { capitalize } from "../common/utils";

type AccountType = "bank" | "cash";

interface Props {
	type: AccountType;
	isSelected: boolean;
	onSelect: () => void;
}

export default function FinanceAccountSelectorItem({
	type,
	isSelected,
	onSelect,
}: Props) {
	const label = capitalize(type);
	return (
		<>
			<input
				type="radio"
				name="transaction-type"
				className="hidden"
				id={`transaction-type-${type}`}
				value={type}
				onChange={onSelect}
			/>
			<label
				className={`h-20 block text-center border ${isSelected ? "border-blue-500 bg-blue-300/10" : "border-gray/50 bg-gray/05"} rounded-lg px-4 py-2 cursor-pointer transition-colors duration-75`}
				htmlFor={`transaction-type-${type}`}
			>
				{type === "cash" ? (
					<Banknote className="text-green-400" />
				) : (
					<Landmark className="text-blue-400" />
				)}

				<span className="ml-2">{label}</span>
			</label>
		</>
	);
}
