import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DefaultLayout from "../../layout/DefaultLayout";

type FinanceFormData = {
  expenseType: string;
  description: string;
  amount: number;
  dateTime: string;
  paymentMethod: string;
  billFile: FileList;
};

const AddFinanceRecord: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm<FinanceFormData>();
  const [fileName, setFileName] = useState("");

  const onSubmit = (data: FinanceFormData) => {
    console.log("Submitted:", data);
  };

  const handleTemplateClick = () => {
    setValue("expenseType", "Office Supplies");
    setValue("description", "Purchased printer ink and paper");
    setValue("amount", 1800);
    setValue("paymentMethod", "cash");
  };

  return (
    <DefaultLayout>
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
      <h2 className="text-2xl font-semibold mb-6">Add Finance Record</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block font-medium">Expense Type</label>
          <input
            {...register("expenseType", { required: true })}
            className="w-full mt-1 border px-3 py-2 rounded-md"
            placeholder="e.g., Travel"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            {...register("description")}
            className="w-full mt-1 border px-3 py-2 rounded-md"
            placeholder="Write a short description"
          />
        </div>

        <div>
          <label className="block font-medium">Amount</label>
          <input
            type="number"
            {...register("amount", { required: true })}
            className="w-full mt-1 border px-3 py-2 rounded-md"
            placeholder="1000"
          />
        </div>

        <div>
          <label className="block font-medium">Date & Time</label>
          <input
            type="datetime-local"
            {...register("dateTime", { required: true })}
            className="w-full mt-1 border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium">Payment Method</label>
          <select
            {...register("paymentMethod", { required: true })}
            className="w-full mt-1 border px-3 py-2 rounded-md"
          >
            <option value="">Select method</option>
            <option value="cash">Cash</option>
            <option value="credit">Credit/Debit Card</option>
            <option value="online">Online Transfer</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

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

        <div className="flex justify-between items-center pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Record
          </button>
          <button
            type="button"
            onClick={handleTemplateClick}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
          >
            Use Template
          </button>
        </div>
      </form>
    </div>
    </DefaultLayout>
  );
};

export default AddFinanceRecord;
