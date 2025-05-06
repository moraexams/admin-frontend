import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import * as z from "zod";
import DefaultLayout from "../../layout/DefaultLayout";
import toast, { Toaster } from "react-hot-toast";
import { format } from "date-fns-tz";
import FinanceTransactionTypeSelectorItem from "../../components/FinanceTransactionTypeSelectorItem";

const financeSchema = z.object({
  transactionType: z.enum(["income", "expense"]),
  type: z.string().nonempty("Please select a type"),
  description: z.string().optional(),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  dateTime: z.string().nonempty("Date & Time is required"),
  paymentMethod: z.string().nonempty("Select a payment method"),
  billFile: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) =>
        !files || files.every((file) => ["image/", "application/pdf"].some((type) => file.type.startsWith(type))),
      "Only image or PDF files are allowed"
    ),
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
      paymentMethod: "cash",
    },
  });

  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const resetForm = () => {
    reset({
      transactionType: "expense",
      type: "",
      description: "",
      amount: 0,
      dateTime: getCurrentDateTime(),
      paymentMethod: "cash",
      billFile: [],
    });
    setFileName("");
    setFilePreview(null);
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (acceptedFiles[0]?.size > maxSize) {
        toast.error("File size exceeds 5 MB");
        return;
      }

      if (acceptedFiles?.[0]) {
        const serialNo = new Date().getTime(); // Use timestamp as a unique serial number
        const transactionType = watch("transactionType"); // Get the current transaction type
        const expenseType = watch("type"); // Get the current expense type
        const fileExtension = acceptedFiles[0].name.split(".").pop(); // Extract file extension

        // Determine the file name based on transaction type and expense type
        let renamedFileName = `${transactionType}_${serialNo}.${fileExtension}`;
        if (transactionType === "expense" && expenseType.toLowerCase() === "transport") {
          renamedFileName = `transport_${serialNo}.${fileExtension}`;
        }

        const renamedFile = new File([acceptedFiles[0]], renamedFileName, {
          type: acceptedFiles[0].type,
        });

        setValue("billFile", [renamedFile]); // Store the renamed file
        setFileName(renamedFileName); // Update the file name in the UI

        if (renamedFile.type.startsWith("image/")) {
          setFilePreview(URL.createObjectURL(renamedFile)); // Generate preview for images
        } else {
          setFilePreview(null); // No preview for non-image files
        }

        toast.success(`File renamed to ${renamedFileName}`);
      }
    },
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
    multiple: false, // Allow only one file
  });

  return (
    <DefaultLayout>
      <Toaster position="top-right" />
      <div className="bg-white text-black max-w-2xl mx-auto p-6 shadow-md rounded-xl mt-8 dark:bg-boxdark dark:text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Add Finance Record</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          <div>
            <span className="block font-medium mb-2">Transaction Type</span>
            <div className="grid grid-cols-2 gap-2">
              <FinanceTransactionTypeSelectorItem isSelected={watch("transactionType") === "income"} onSelect={() => setValue("transactionType", "income")} type="income" />
              <FinanceTransactionTypeSelectorItem isSelected={watch("transactionType") === "expense"} onSelect={() => setValue("transactionType", "expense")} type="expense" />
            </div>
          </div>
          
          {/* Type */}
          <div>
            <label className="block font-medium">Category</label>
            <select
              {...register("type")}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="">Select type</option>
              {["salary", "rent", "utilities", "sales", "misc"].map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            {errors.type && (
              <span className="text-red-500 text-sm">{errors.type.message}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              {...register("description")}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              placeholder="Write a short description"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block font-medium">Amount</label>
            <input
              type="number"
              {...register("amount")}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              placeholder="0000"
            />
            {errors.amount && (
              <span className="text-red-500 text-sm">{errors.amount.message}</span>
            )}
          </div>

          {/* Date and Time */}
          <div>
            <label className="block font-medium">Date & Time</label>
            <input
              type="datetime-local"
              {...register("dateTime")}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.dateTime && (
              <span className="text-red-500 text-sm">{errors.dateTime.message}</span>
            )}
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
                    {...register("paymentMethod")}
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
            {errors.paymentMethod && (
              <span className="text-red-500 text-sm">{errors.paymentMethod.message}</span>
            )}
          </div>

          {/* Bill Upload */}
          <div>
            <label className="block font-medium mb-1">Upload Bill</label>
            <div
              {...getRootProps()}
              className="w-full px-4 py-10 text-center border-2 border-dashed rounded-md transition-colors cursor-pointer border-gray-300 bg-white dark:bg-form-input dark:border-form-strokedark dark:text-white"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-blue-500">Drop the file here ...</p>
              ) : (
                <p className="text-sm text-gray-500">
                  Drag & drop a bill file here, or click to select
                </p>
              )}
              {fileName && (
                <p className="text-sm mt-2 text-gray-600">Selected: {fileName}</p>
              )}
              {filePreview && (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="mx-auto mt-2 max-h-48 rounded-md"
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end pt-4 space-x-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 rounded-md shadow-md bg-red-500 hover:bg-red-600 text-white"
            >
              Reset Form
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
