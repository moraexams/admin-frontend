import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Table from "../../components/Table";
import DefaultLayout from "../../layout/DefaultLayout";
import { getAllTransactionCategories } from "../../services/financeServices";
import type { TransactionCategory } from "../../types/finance";

export default function TransactionCategories() {
	const [categories, setCategories] = useState<Array<TransactionCategory>>([]);

	useEffect(() => {
		getAllTransactionCategories()
			.then((response) => {
				setCategories(response.data);
			})
			.catch((error) => {
				console.error("Error fetching audit logs:", error);
				toast.error("Failed to fetch audit logs. Please try again later.");
			});
	}, []);

	return (
		<DefaultLayout>
			<Breadcrumb pageName="Transaction Categories" />

			<Table
				headers={["Id", "Name"]}
				data={categories.map((log) => [log.id, log.name])}
			/>
		</DefaultLayout>
	);
}
