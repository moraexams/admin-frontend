import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { Transaction } from "../../types/finance";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { useParams } from "react-router-dom";
import { getTransaction } from "../../services/financeServices";

export default function AddBill() {
  const params = useParams();
  const [transaction, setTransaction] = useState<Transaction | null | undefined>();
  
  useEffect(() => {
    const transactionId = params["transaction-id"];
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
    <p>
      You are adding a bill relating to the below transaction.
    </p>
    
    <h2 className="mt-6 mb-4 text-xl font-bold">Transaction #{transaction.id}</h2>
    
    <div className="grid grid-cols-2 mb-5 gap-4">
      <div className="rounded-md">
        <p className="text-sm font-medium">Amount</p>
        <p className={`text-lg font-semibold ${transaction.type === "expense" ? "text-red-600" : "text-green-600"}`}>
          LKR {transaction.amount}
        </p>
      </div>
      <div className="rounded-md">
        <p className="text-sm font-medium">Added on</p>
        <p className="text-lg font-semibold text-gray-800">{new Date(transaction.created_at).toLocaleString()}</p>
      </div>
      <div className="rounded-md">
        <p className="text-sm font-medium">Added by</p>
        <p className="text-lg font-semibold text-gray-800">{transaction.created_by_username}</p>
      </div>
      <div className="rounded-md">
        <p className="text-sm font-medium">Description</p>
        <p className="text-lg font-semibold">{transaction.description || "None"}</p>
      </div>
    </div>
    
    <form>
      <div {...getRootProps()} className="text-center py-8 rounded-lg border-2 border-dashed border-gray/60 mb-5">
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
