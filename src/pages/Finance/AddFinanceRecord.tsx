import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns-tz";
import type React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { capitalize } from "../../common/utils";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import FinanceAccountSelectorItem from "../../components/FinanceAccountSelectorItem";
import FinanceTransactionTypeSelectorItem from "../../components/FinanceTransactionTypeSelectorItem";
import DefaultLayout from "../../layout/DefaultLayout";
import { addTransaction } from "../../services/financeServices";
import { type FinanceFormData, financeSchema } from "../../types/finance";

const SRI_LANKA_TIMEZONE = "Asia/Colombo";

const AddFinanceRecord: React.FC = () => {
	const getCurrentDateTime = () =>
		format(new Date(), "yyyy-MM-dd'T'HH:mm", { timeZone: SRI_LANKA_TIMEZONE });

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FinanceFormData>({
		resolver: zodResolver(financeSchema),
		defaultValues: {
			transactionType: "expense",
			createdAt: getCurrentDateTime(),
			paymentAccount: "cash",
			amount: 0, // Initialize amount with a default value of 0
		},
	});

	const resetForm = () => {
		reset({
			transactionType: watch("transactionType"),
			category: "",
			description: "",
			amount: 0,
			createdAt: getCurrentDateTime(),
			paymentAccount: watch("paymentAccount"),
		});
	};

	const onSubmit = async (data: FinanceFormData) => {
		const formattedCreatedAt = format(
			data.createdAt,
			"yyyy-MM-dd'T'HH:mm:ssXXX",
			{ timeZone: SRI_LANKA_TIMEZONE },
		);
		await addTransaction({ ...data, createdAt: formattedCreatedAt })
			.then(() => {
				toast.success("Transaction added successfully!");
				resetForm();
			})
			.catch((error) => {
				console.error(error);
				let message = "Failed to submit record. Please try again later.";
				if (typeof error === "string") {
					message = error;
				}
				toast.error(message);
			});
	};
	console.log(watch("amount"));
	return (
		<DefaultLayout>
			<Breadcrumb pageName="Add Transaction" />
			<div className="bg-white text-black p-6 shadow-md rounded-xl mt-8 dark:bg-boxdark dark:text-white">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="grid grid-cols-1 xl:grid-cols-2 gap-5"
				>
					<div>
						<span className="block font-medium mb-2">Transaction Type</span>
						<div className="grid grid-cols-2 gap-2">
							<FinanceTransactionTypeSelectorItem
								isSelected={watch("transactionType") === "income"}
								onSelect={() => setValue("transactionType", "income")}
								type="income"
							/>
							<FinanceTransactionTypeSelectorItem
								isSelected={watch("transactionType") === "expense"}
								onSelect={() => setValue("transactionType", "expense")}
								type="expense"
							/>
						</div>
					</div>

					<div>
						<label className="block font-medium mb-2" htmlFor="category">
							Category
						</label>
						<select
							{...register("category")}
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
							id="category"
						>
							<option value="">Select category</option>
							{["salary", "rent", "utilities", "sales", "misc"].map(
								(category) => (
									<option key={category} value={category}>
										{capitalize(category)}
									</option>
								),
							)}
						</select>
						{errors.category && (
							<span className="text-red-500 text-sm">
								{errors.category.message}
							</span>
						)}
					</div>

					{/* Amount */}
					<div>
						<label className="block font-medium mb-2" htmlFor="amount">
							Amount
						</label>
						{/* Visible Input for Displaying Comma-Separated Value */}
						<input
							type="text"
							value={watch("amount")?.toLocaleString("en-US") || ""}
							onChange={(e) => {
								const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
								if (!Number.isNaN(Number(rawValue)) && Number(rawValue) >= 0) {
									setValue("amount", Number(rawValue)); // Update the raw value in the form state
								}
							}}
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
							placeholder="000"
						/>

						{/* Hidden Input for Raw Numeric Value */}
						<input
							type="number"
							{...register("amount", {
								valueAsNumber: true, // Ensure the value is treated as a number
								min: {
									value: 0,
									message: "Amount must be greater than or equal to 0",
								},
							})}
							className="hidden"
						/>

						{errors.amount && (
							<span className="text-red-500 text-sm">
								{errors.amount.message}
							</span>
						)}
					</div>

					{/* Date and Time */}
					<div>
						<label className="block font-medium mb-2" htmlFor="dateTime">
							Date & Time
						</label>
						<input
							type="datetime-local"
							{...register("createdAt")}
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
						/>
						{errors.createdAt && (
							<span className="text-red-500 text-sm">
								{errors.createdAt.message}
							</span>
						)}
					</div>

					{/* Description */}
					<div>
						<label className="block font-medium mb-2" htmlFor="description">
							Description
						</label>
						<textarea
							{...register("description")}
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary resize-none"
							placeholder="Write a short description"
						/>
					</div>

					<div>
						<span className="block font-medium mb-2">Payment Account</span>
						<div className="grid grid-cols-2 gap-2">
							<FinanceAccountSelectorItem
								isSelected={watch("paymentAccount") === "cash"}
								onSelect={setValue.bind(null, "paymentAccount", "cash")}
								type="cash"
							/>
							<FinanceAccountSelectorItem
								isSelected={watch("paymentAccount") === "bank"}
								onSelect={setValue.bind(null, "paymentAccount", "bank")}
								type="bank"
							/>
						</div>
					</div>

					{/* Buttons */}
					<div className="xl:col-start-2 ml-auto h-fit mt-auto space-x-3">
						<button
							type="button"
							onClick={resetForm}
							className="px-6 py-2 rounded-md shadow-md bg-red-500 hover:bg-red-600 text-white"
						>
							Reset
						</button>

						<button
							type="submit"
							disabled={isSubmitting}
							className="px-6 py-2 rounded-md shadow-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
						>
							{isSubmitting ? "Submitting..." : "Add Record"}
						</button>
					</div>
				</form>
			</div>
		</DefaultLayout>
	);
};

export default AddFinanceRecord;
