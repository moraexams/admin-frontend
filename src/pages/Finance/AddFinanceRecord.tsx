import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DefaultLayout from "../../layout/DefaultLayout";

type FinanceFormData = {
  transactionType: "income" | "expense";
  expenseType: string;
  description: string;
  amount: number;
  dateTime: string;
  paymentMethod: string;
  billFile: FileList;
};

const expenseTypes = [
  "Travel",
  "Office Supplies",
  "Maintenance",
  "Utilities",
  "Salaries",
  "Entertainment",
  "Training",
  "Other",
];

const incomeTypes = [
  "Salary",
  "Freelancing",
  "Investment Return",
  "Bonus",
  "Business Revenue",
  "Other",
];

const AddFinanceRecord: React.FC = () => {
  const { register, handleSubmit, setValue, watch } = useForm<FinanceFormData>({
    defaultValues: {
      transactionType: "expense",
    },
  });
  const transactionType = watch("transactionType");
  const [fileName, setFileName] = useState("");

  const onSubmit = (data: FinanceFormData) => {
    console.log("Submitted:", data);
  };

  // const handleTemplateClick = () => {
  //   setValue("transactionType", "expense");
  //   setValue("expenseType", "Office Supplies");
  //   setValue("description", "Purchased printer ink and paper");
  //   setValue("amount", 1800);
  //   setValue("paymentMethod", "cash");
  // };

  const typeOptions = transactionType === "income" ? incomeTypes : expenseTypes;

  return (
    <DefaultLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
        <h2 className="text-2xl font-semibold mb-6">Add Finance Record</h2>

        {/* Toggle Button */}
        <div className="flex space-x-4 mb-6">
          <button
            type="button"
            className={`px-4 py-2 rounded-md font-medium ${
              transactionType === "expense"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setValue("transactionType", "expense")}
          >
            Expense
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md font-medium ${
              transactionType === "income"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setValue("transactionType", "income")}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Expense/Income Type */}
          <div>
            <label className="block font-medium">
              {transactionType === "income" ? "Income Source" : "Expense Type"}
            </label>
            <select
              {...register("expenseType", { required: true })}
              className="w-full mt-1 border px-3 py-2 rounded-md"
            >
              <option value="">Select type</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              {...register("description")}
              className="w-full mt-1 border px-3 py-2 rounded-md"
              placeholder="Write a short description"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block font-medium">Amount</label>
            <input
              type="number"
              {...register("amount", { required: true })}
              className="w-full mt-1 border px-3 py-2 rounded-md"
              placeholder="1000"
            />
          </div>

          {/* Date and Time */}
          <div>
            <label className="block font-medium">Date & Time</label>
            <input
              type="datetime-local"
              {...register("dateTime", { required: true })}
              className="w-full mt-1 border px-3 py-2 rounded-md"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block font-medium mb-2">Payment Method</label>
              <div className="flex flex-wrap gap-4">
                {["cash", "credit", "online", "bank"].map((method) => (
                  <label key={method} className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={method}
                      {...register("paymentMethod", { required: true })}
                      className="accent-blue-600"
                    />
                    <span className="capitalize">{method === "credit" ? "Credit/Debit Card" : method === "online" ? "Online Transfer" : method === "bank" ? "Bank Transfer" : "Cash"}</span>
                  </label>
                ))}
              </div>
          </div>


          {/* Bill Upload */}
          <div>
            <label className="block font-medium">Upload Bill</label>
            <input
              type="file"
              {...register("billFile")}
              accept="image/*,application/pdf"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFileName(e.target.files[0].name);
                }
              }}
              className="w-full mt-1"
            />
            {fileName && (
              <p className="text-sm text-gray-600 mt-1">Selected: {fileName}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Record
            </button>
            {/* <button
              type="button"
              onClick={handleTemplateClick}
              className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
            >
              Use Template
            </button> */}
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default AddFinanceRecord;
