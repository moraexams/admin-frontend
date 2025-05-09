import type React from "react";
import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";

type ImageItem = {
	id: string;
	url: string;
	remark: string;
	category: string;
};

const sampleImages: ImageItem[] = [
	{
		id: "1",
		url: "/images/task/task-01.jpg",
		remark: "task",
		category: "Jaffna",
	},
	{
		id: "2",
		url: "/images/logo/logo-light.jpg",
		remark: "logo",
		category: "Colombo",
	},
	{
		id: "3",
		url: "/images/logo/logo-dark.svg",
		remark: "branding",
		category: "Jaffna",
	},
];

const Gallery: React.FC = () => {
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("All");

	const categories = [
		"All",
		...Array.from(new Set(sampleImages.map((img) => img.category))),
	];

	const filteredImages = sampleImages.filter(
		(img) =>
			(category === "All" || img.category === category) &&
			img.remark.toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<DefaultLayout>
			<Breadcrumb pageName="Bill Gallery" />
			<div className="min-h-screen bg-gray-50 dark:bg-boxdark p-6">
				<div className="max-w-5xl mx-auto">
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="w-full md:w-1/3 rounded border border-stroke bg-white py-2 px-4 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
						>
							{categories.map((cat) => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
						</select>

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
							filteredImages.map((img) => (
								<div
									key={img.id}
									className="bg-white dark:bg-boxdark rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
								>
									<img
										src={img.url}
										alt={img.remark}
										className="w-full h-48 object-cover"
									/>
									<div className="p-4">
										<p className="text-sm text-gray-700 dark:text-white">
											{img.remark}
										</p>
									</div>
								</div>
							))
						) : (
							<p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
								No images match your search.
							</p>
						)}
					</div>
				</div>
			</div>
		</DefaultLayout>
	);
};

export default Gallery;
