import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { Transaction } from "../../types/financeIndex";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { useParams } from "react-router-dom";
import { getTransaction } from "../../services/financeServices";

export default function AddBill() {
  const params = useParams();
  const [transaction, setTransaction] = useState<Transaction | null | undefined>();
  
  useEffect(() => {
    const transactionId = params["transaction-id"];
    console.log(transactionId);
    if (transactionId === undefined) {
      setTransaction(null);
      return;
    }
    getTransaction(transactionId).then(r => {
      setTransaction(r.data);
    }).catch(console.error);
  }, [params]);
  
  const handleDrop = (acceptedFiles: unknown) => {
    console.log(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/*": [],
      "application/pdf": []
    }
  });
  
  if (transaction === undefined) {
    return <DefaultLayout>
      <Breadcrumb pageName="Add Bill" />
      <div>
        Loading...
      </div>
    </DefaultLayout>;
    
  }
  
  if (transaction == null) {
    return <DefaultLayout>
      <Breadcrumb pageName="Add Bill" />
      <div>
        Invalid transaction id.
      </div>
    </DefaultLayout>;
  }

  return (
  <DefaultLayout>
    <Breadcrumb pageName="Add Bill" />
    
    <div className="mb-4">
        <h2 className="text-xl font-bold">Transaction #{transaction.id}</h2>
      <span className="px-3 py-1 text-sm font-medium text-white">
        {transaction.created_at}
      </span>
    </div>
    
    <div className={`p-3 rounded-md shadow-sm ${transaction.amount < 0 ? "bg-red-100" : "bg-green-100"}`}>
      <p className="text-sm font-medium text-gray-500">Amount</p>
      <p className={`text-lg font-semibold ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}>
        ${Math.abs(transaction.amount)}
      </p>
    </div>
    
    
    <div className="grid grid-cols-2 gap-4">
      <div className="p-3 bg-white rounded-md shadow-sm">
        <p className="text-sm font-medium text-gray-500">Amount</p>
        <p className="text-lg font-semibold text-gray-800">${transaction.amount}</p>
      </div>
      <div className="p-3 bg-white rounded-md shadow-sm">
        <p className="text-sm font-medium text-gray-500">Date</p>
        <p className="text-lg font-semibold text-gray-800">{new Date(transaction.created_at).toLocaleDateString()}</p>
      </div>
      <div className="p-3 bg-white rounded-md shadow-sm">
        <p className="text-sm font-medium text-gray-500">Description</p>
        <p className="text-lg font-semibold text-gray-800">{transaction.description || "No description provided"}</p>
      </div>
    </div>
    
    <form>
      <div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: "20px", textAlign: "center" }}>
        <input {...getInputProps()} />
        <p>Drag & drop files here, or click to select files</p>
      </div>
      
      <button
							type="submit"
							className="px-6 py-2 rounded-md shadow-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
						>
						Submit
						</button>
    </form>
  </DefaultLayout>
  );
}
