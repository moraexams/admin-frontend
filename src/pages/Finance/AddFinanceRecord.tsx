import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns-tz";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { capitalize } from "../../common/utils";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import FinanceAccountSelectorItem from "../../components/FinanceAccountSelectorItem";
import FinanceTransactionTypeSelectorItem from "../../components/FinanceTransactionTypeSelectorItem";
import DefaultLayout from "../../layout/DefaultLayout";
import {
	addTransaction,
	getAllTransactionCategories,
	getAllTransactionDistricts,
} from "../../services/financeServices";
import {
	type FinanceFormData,
	type TransactionCategory,
	type TransactionDistrict,
	financeSchema,
} from "../../types/finance";

const SRI_LANKA_TIMEZONE = "Asia/Colombo";

const AddFinanceRecord: React.FC = () => {
	const [categories, setCategories] = useState<TransactionCategory[]>([]);
	const [districts, setDistricts] = useState<TransactionDistrict[]>([]);

	const getCurrentDateTime = () =>
		format(new Date(), "yyyy-MM-dd'T'HH:mm", { timeZone: SRI_LANKA_TIMEZONE });

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		watch,
		formState: { errors, isSubmitting, dirtyFields },
	} = useForm<FinanceFormData>({
		resolver: zodResolver(financeSchema),
		defaultValues: {
			district: 0,
			transactionType: "expense",
			createdAt: getCurrentDateTime(),
			paymentAccount: "cash",
			amount: 0,
		},
	});

	const [amountInput, setAmountInput] = useState("0");

	useEffect(() => {
		const parsed = Number.parseFloat(amountInput);
		setValue("amount", isNaN(parsed) ? 0 : parsed, { shouldValidate: true });
	}, [amountInput, setValue]);

	const resetForm = () => {
		reset({
			transactionType: watch("transactionType"),
			description: "",
			amount: 0,
			createdAt: getCurrentDateTime(),
			paymentAccount: watch("paymentAccount"),
			district: 0,
		});
		setAmountInput("0");
	};

	const onSubmit = async (data: FinanceFormData) => {
		try {
			const formattedCreatedAt = format(
				data.createdAt,
				"yyyy-MM-dd'T'HH:mm:ssXXX",
				{ timeZone: SRI_LANKA_TIMEZONE },
			);
			await addTransaction({ ...data, createdAt: formattedCreatedAt });
			toast.success("Transaction added successfully!");
			resetForm();
		} catch (error) {
			console.error(error);
			let message = "Failed to submit record. Please try again later.";
			if (typeof error === "string") {
				message = error;
			}
			toast.error(message);
		}
	};

	useEffect(() => {
		getAllTransactionCategories()
			.then((response) => {
				setCategories(response.data);
			})
			.catch((error) => {
				let message = "Failed to fetch categories. Please try again later.";
				if (typeof error === "string") {
					message = error;
				}
				toast.error(message);
			});
	}, []);

	useEffect(() => {
		getAllTransactionDistricts()
			.then((response) => {
				setDistricts(response.data);
			})
			.catch((error) => {
				let message = "Failed to fetch districts. Please try again later.";
				if (typeof error === "string") {
					message = error;
				}
				toast.error(message);
			});
	}, []);

	return (
		<DefaultLayout>
			<Breadcrumb
				pageName="Add Transaction"
				dashboardPath="/finance/dashboard"
			/>
			<div className="bg-white text-black p-6 shadow-md rounded-xl mt-8 dark:bg-boxdark dark:text-white">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="grid grid-cols-1 xl:grid-cols-2 gap-5"
				>
					{/* Transaction Type */}
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

					{/* Category */}
					<div>
						<label className="block font-medium mb-2" htmlFor="category">
							Category
						</label>
						<select
							{...register("category")}
							id="category"
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
						>
							<option value="">Select category</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{capitalize(category.name)}
								</option>
							))}
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
						<input
							type="number"
							id="amount"
							step="0.01"
							inputMode="decimal"
							value={amountInput}
							onChange={(e) => {
								const newVal = e.target.value;
								if (
									amountInput === "0" &&
									newVal !== "0" &&
									!newVal.startsWith("0.")
								) {
									setAmountInput(newVal.replace(/^0+/, ""));
								} else {
									setAmountInput(newVal);
								}
							}}
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
						/>
						{dirtyFields.amount && errors.amount ? (
							<span className="text-red-500 text-sm">
								{errors.amount.message}
							</span>
						) : null}
					</div>

					{/* District */}
					<div>
						<label className="block font-medium mb-2" htmlFor="district">
							District
						</label>
						<select
							{...register("district")}
							id="district"
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
						>
							<option value={0}>None</option>
							{districts.map((district) => (
								<option key={district.id} value={district.id}>
									{capitalize(district.name)}
								</option>
							))}
						</select>
						{errors.district && (
							<span className="text-red-500 text-sm">
								{errors.district.message}
							</span>
						)}
					</div>

					{/* Date and Time */}
					<div>
						<label className="block font-medium mb-2" htmlFor="createdAt">
							Date & Time
						</label>
						<input
							type="datetime-local"
							id="createdAt"
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
							id="description"
							{...register("description")}
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary resize-none"
							placeholder="Write a short description"
						/>
					</div>

					{/* Payment Account */}
					<div>
						<span className="block font-medium mb-2">Payment Account</span>
						<div className="grid grid-cols-2 gap-2">
							<FinanceAccountSelectorItem
								isSelected={watch("paymentAccount") === "cash"}
								onSelect={() => setValue("paymentAccount", "cash")}
								type="cash"
							/>
							<FinanceAccountSelectorItem
								isSelected={watch("paymentAccount") === "bank"}
								onSelect={() => setValue("paymentAccount", "bank")}
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
