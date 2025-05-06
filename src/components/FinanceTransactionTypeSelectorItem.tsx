import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { capitalize } from "../common/utils";

type FinanceTransactionType = "income" | "expense";

interface Props {
  type: FinanceTransactionType;
  isSelected: boolean;
  onSelect: () => void;
}

export default function FinanceTransactionTypeSelectorItem({ type, isSelected, onSelect }: Props) {
  const label = capitalize(type);
  return (
    <>
      <input type="radio" name="transaction-type" className="hidden" id={`transaction-type-${type}`} value={type} onChange={onSelect} />
      <label className={`block text-center border ${type === "income" ? "border-green-400" : "border-red-400"} ${!isSelected ? "": type === "income" ? "bg-green-400/20" : "bg-red-400/20"} rounded-lg px-4 py-2 cursor-pointer transition-colors duration-75`} htmlFor={`transaction-type-${type}`}>
        
        {type === "income" ? 
          <BanknoteArrowUp className="inline-block text-green-400" />
          :
          <BanknoteArrowDown className="inline-block text-red-400" />
        }
        
        <span className="ml-2">
        {label}
        </span>
      </label>
    </>
  );
}
