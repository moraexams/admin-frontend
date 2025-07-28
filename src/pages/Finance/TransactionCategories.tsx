import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Table from "../../components/Table";
import {
	addTransactionCategory,
	getAllTransactionCategories,
} from "../../services/financeServices";
import type { TransactionCategory } from "../../types/finance";

export default function TransactionCategories() {
	const [categories, setCategories] = useState<Array<TransactionCategory>>([]);
	const [category, setCategory] = useState<string>("");
	const [fetching, setFetching] = useState<boolean>(false);
	useEffect(() => {
		getAllTransactionCategories()
			.then((response) => {
				setCategories(response.data);
			})
			.catch((error) => {
				console.error("Error fetching audit logs:", error);
				toast.error("Failed to fetch audit logs. Please try again later.");
			});
	}, [fetching]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!category.trim()) {
			toast.error("Category name cannot be empty.");
			return;
		}

		try {
			const response = await addTransactionCategory(category.trim());

			// ✅ Access the actual category from response.data
			const newCategory = response.data.category;

			// Add to list
			setCategories((prev) => [...prev, newCategory]);

			toast.success("Category added successfully.");
			setCategory("");
			setFetching(!fetching);
		} catch (error) {
			console.error("Error adding category:", error);
			toast.error("Failed to add category. Please try again.");
		}
	};

	return (
		<>
			<Breadcrumb
				pageName="Transaction Categories"
				dashboardPath="/finance/dashboard"
			/>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col items-center gap-4 mt-6"
			>
				<input
					type="text"
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					placeholder="Enter category name"
					className="w-full md:w-1/2 rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-hidden transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
				/>
				<button
					type="submit"
					className="w-full md:w-1/2 rounded-sm border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90 mb-5"
				>
					Add Category
				</button>
			</form>
			<Table
				headers={["Id", "Name", "Actions"]}
				data={categories
					.filter(
						(log) => log && log.id !== undefined && log.name !== undefined,
					)
					.map((log) => [log.id, log.name])}
			/>
		</>
	);
}
