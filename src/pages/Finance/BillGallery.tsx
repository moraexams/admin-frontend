import type React from "react";
import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { getAllBills } from "../../services/financeServices";

interface BillImage {
	id: string;
	associated_record: string;
	created_at: string;
	file_type: string;
	image_url: string;
	description: string;
}

const Gallery: React.FC = () => {
	const [query, setQuery] = useState("");
	// const [category, setCategory] = useState("All");
	const [images, setImages] = useState<Array<BillImage>>([]);

	// const categories = [
	// 	"All",
	// 	...Array.from(new Set(sampleImages.map((img) => img.category))),
	// ];

	const filteredImages = images.filter((img) =>
		img.description.toLowerCase().includes(query.toLowerCase()),
	);

	useEffect(() => {
		getAllBills()
			.then((response) => {
				setImages(response.data.bills);
			})
			.catch(console.error);
	}, []);

	return (
		<DefaultLayout>
			<Breadcrumb pageName="Bill Gallery" />
			<div className="min-h-screen bg-gray-50 dark:bg-boxdark p-6">
				<div className="max-w-5xl mx-auto">
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						{/* <select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="w-full md:w-1/3 rounded border border-stroke bg-white py-2 px-4 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
						>
							{categories.map((cat) => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
						</select> */}

						<input
							type="text"
							placeholder="Search by remark..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="w-full md:flex-1 rounded border border-stroke bg-white py-2 px-4 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
						{filteredImages.length > 0 ? (
							filteredImages.map((img) => {
								return (
									<div
										key={img.id}
										className="bg-white dark:bg-boxdark rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
									>
										<img
											src={import.meta.env.VITE_BACKEND_URL.concat(
												img.image_url,
											)}
											alt={img.description}
											className="w-full h-48 object-cover"
										/>
										<div className="p-4">
											<p className="text-sm text-gray-700 dark:text-white">
												{img.description}
											</p>
										</div>
									</div>
								);
							})
						) : (
							<p className="col-span-full text-center text-lg">
								No bills found.
							</p>
						)}
					</div>
				</div>
			</div>
		</DefaultLayout>
	);
};

export default Gallery;
