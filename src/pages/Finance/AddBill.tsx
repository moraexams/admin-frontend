import {
	type ChangeEvent,
	type FormEventHandler,
	useEffect,
	useState,
} from "react";
import { type FileWithPath, useDropzone } from "react-dropzone";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import {
	addBillToTransaction,
	getTransaction,
} from "../../services/financeServices";
import type { SelectedFile, Transaction } from "../../types/finance";
import { CircleX } from "lucide-react";

export default function AddBill() {
	const params = useParams();
	const [selectedFiles, setSelectedFiles] = useState<Array<SelectedFile>>([]);
	const [transaction, setTransaction] = useState<
		Transaction | null | undefined
	>();

	useEffect(() => {
		const transactionId = params["transaction-id"];
		if (transactionId === undefined) {
			setTransaction(null);
			return;
		}
		getTransaction(transactionId)
			.then((r) => {
				setTransaction(r.data);
			})
			.catch(console.error);
	}, [params]);

	const handleDrop = (acceptedFiles: Array<FileWithPath>) => {
		setSelectedFiles(
			acceptedFiles.map((file) => {
				return {
					baseFile: file,
					description: "",
				};
			}),
		);
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: handleDrop,
		accept: {
			"image/*": [],
			"application/pdf": [],
		},
	});

	if (transaction === undefined) {
		return (
			<DefaultLayout>
				<Breadcrumb pageName="Add Bill" />
				<div>Loading...</div>
			</DefaultLayout>
		);
	}

	if (transaction == null) {
		return (
			<DefaultLayout>
				<Breadcrumb pageName="Add Bill" />
				<div>Invalid transaction id.</div>
			</DefaultLayout>
		);
	}

	const updateFileDescription = (
		fileIndex: number,
		event: ChangeEvent<HTMLInputElement>,
	) => {
		const v = event.target.value;
		setSelectedFiles((selectedFiles) => {
			const d = selectedFiles.slice();
			d[fileIndex].description = v;
			return d;
		});
	};

	const handleFormSubmit: FormEventHandler = (event) => {
		event.preventDefault();
		if (!(event.target instanceof HTMLFormElement)) {
			return;
		}
		if (!transaction) {
			return;
		}

		addBillToTransaction(transaction.id, selectedFiles)
			.then(() => {
				setSelectedFiles([]);
				toast.success("Bills added successfully");
			})
			.catch((e) => {
				toast.error("Some error occurred");
				console.error(e);
			});
	};
	
	const removeBilFile = (fileIndex: number) => {
		setSelectedFiles((selectedFiles) => {
			const d = selectedFiles.slice();
			d.splice(fileIndex, 1);
			return d;
		});
	};

	return (
		<DefaultLayout>
			<Breadcrumb pageName="Add Bill" dashboardPath="/finance/dashboard" />
			<Toaster position="top-right" />
			<p>You are adding a bill relating to the below transaction.</p>

			<h2 className="mt-6 mb-4 text-xl font-bold">
				Transaction #{transaction.id}
			</h2>

			<div className="grid grid-cols-2 mb-4 gap-4">
				<div className="rounded-md">
					<p className="text-sm font-medium">Amount</p>
					<p
						className={`text-lg font-semibold ${transaction.type === "expense" ? "text-red-600" : "text-green-600"}`}
					>
						LKR {transaction.amount}
					</p>
				</div>
				<div className="rounded-md">
					<p className="text-sm font-medium">Added on</p>
					<p className="text-lg font-semibold text-gray-800">
						{new Date(transaction.created_at).toLocaleString()}
					</p>
				</div>
				<div className="rounded-md">
					<p className="text-sm font-medium">Added by</p>
					<p className="text-lg font-semibold text-gray-800">
						{transaction.created_by_username}
					</p>
				</div>
				<div className="rounded-md">
					<p className="text-sm font-medium">Description</p>
					<p className="text-lg font-semibold">
						{transaction.description || "None"}
					</p>
				</div>
			</div>

			<p className="my-4">
				You can select{" "}
				<u className="font-medium">image and pdf files which are under 1MB</u>.
				You can optionally add a description for each file.
			</p>

			<form onSubmit={handleFormSubmit}>
				<div
					{...getRootProps()}
					className="text-center py-8 rounded-lg cursor-pointer border-2 border-dashed border-gray/60 mb-5"
				>
					<input {...getInputProps()} />
					<p>Drag & drop files here, or click to select files</p>
				</div>

				{selectedFiles.length === 0 ? null : (
					<table className="mb-4 w-full">
						<thead>
							<tr className="font-medium">
							<th></th>
								<th className="text-left">Filename</th>
								<th>Size</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							{selectedFiles.map((file, index) => (
								<tr key={file.baseFile.name}>
									<td className="w-fit">
										<button className="text-red-600 hover:text-red-700 hover:bg-zinc-200 p-2 rounded-full" type="button" onClick={() => removeBilFile(index)}>
												<CircleX className="size-5" />
										</button>
									</td>
									<td className="py-2 text-gray-800 col-span-2">
										{file.baseFile.name}
									</td>
									<td className="text-center text-gray-600">
										{(file.baseFile.size / 1024).toFixed(2)} KB
									</td>
									<td className="text-center">
										<input
											className="w-full py-1 bg-transparent border px-2 rounded-md"
											onChange={updateFileDescription.bind(null, index)}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}

				<div className="flex justify-end">
					<button
						type="submit"
						className="px-6 py-2 rounded-md shadow-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
					>
						Submit
					</button>
				</div>
			</form>
		</DefaultLayout>
	);
}
