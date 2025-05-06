import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns-tz";
import type React from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import * as z from "zod";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import FinanceAccountSelectorItem from "../../components/FinanceAccountSelectorItem";
import FinanceTransactionTypeSelectorItem from "../../components/FinanceTransactionTypeSelectorItem";
import DefaultLayout from "../../layout/DefaultLayout";

const financeSchema = z.object({
	transactionType: z.enum(["income", "expense"]),
	type: z.string().nonempty("Please select a type"),
	description: z.string().optional(),
	amount: z.coerce.number().min(1, "Amount must be greater than 0"),
	dateTime: z.string().nonempty("Date & Time is required"),
	paymentAccount: z.enum(["bank", "cash"]),
});

type FinanceFormData = z.infer<typeof financeSchema>;

const AddFinanceRecord: React.FC = () => {
	const sriLankanTimeZone = "Asia/Colombo";
	const getCurrentDateTime = () =>
		format(new Date(), "yyyy-MM-dd'T'HH:mm", { timeZone: sriLankanTimeZone });

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
			dateTime: getCurrentDateTime(),
			paymentAccount: "cash",
		},
	});

	const resetForm = () => {
		reset({
			transactionType: "expense",
			type: "",
			description: "",
			amount: 0,
			dateTime: getCurrentDateTime(),
			paymentAccount: "cash",
		});
		toast.success("Form reset successfully!");
	};

	const onSubmit = async (data: FinanceFormData) => {
		try {
			console.log("Submitted:", data);
			toast.success("Record added successfully!");
			resetForm();
		} catch (error) {
			console.error(error);
			toast.error("Failed to submit record. Please try again later.");
		}
	};

	return (
		<DefaultLayout>
			<Breadcrumb pageName="Add Finance Record" />
			<Toaster position="top-right" />
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

					{/* Type */}
					<div>
						<label className="block font-medium mb-2" htmlFor="category">
							Category
						</label>
						<select
							{...register("type")}
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
							id="category"
						>
							<option value="">Select type</option>
							{["salary", "rent", "utilities", "sales", "misc"].map((type) => (
								<option key={type} value={type}>
									{type.charAt(0).toUpperCase() + type.slice(1)}
								</option>
							))}
						</select>
						{errors.type && (
							<span className="text-red-500 text-sm">
								{errors.type.message}
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
							{...register("amount")}
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
							placeholder="0000.00"
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
							{...register("dateTime")}
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
						/>
						{errors.dateTime && (
							<span className="text-red-500 text-sm">
								{errors.dateTime.message}
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
