import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
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

  const typeOptions = transactionType === "income" ? incomeTypes : expenseTypes;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        // @ts-ignore
        setValue("billFile", acceptedFiles);
        setFileName(acceptedFiles[0].name);
      }
    },
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
    multiple: false,
  });

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
              placeholder="0000"
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
                  <span className="capitalize">
                    {method === "credit"
                      ? "Credit/Debit Card"
                      : method === "online"
                      ? "Online Transfer"
                      : method === "bank"
                      ? "Bank Transfer"
                      : "Cash"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Bill Upload - Dropzone */}
          <div>
            <label className="block font-medium mb-1">Upload Bill</label>
            <div
              {...getRootProps()}
              className={`w-full px-4 py-10 text-center border-2 border-dashed rounded-md transition-colors cursor-pointer ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-blue-500">Drop the file here ...</p>
              ) : (
                <p className="text-gray-500">
                  Drag & drop a bill file here, or click to select
                </p>
              )}
              {fileName && (
                <p className="text-sm text-gray-600 mt-2">Selected: {fileName}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Record
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default AddFinanceRecord;
