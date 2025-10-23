import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getAllExamCenters } from "@/services/examCentreService";
import { downloadResultsSheetForStreamAndExamCentre } from "@/services/statsServices";
import { createTimer } from "@/services/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DownloadResultSheet() {
	const [selectedStream, setSelectedStream] = useState<string | null>(null);
	const [examCentres, setExamCentres] = useState<
		Array<{ id: number; name: string }>
	>([]);
	const [selectedExamCentre, setSelectedExamCentre] =
		useState<string>("undefined"); // "undefined" for all

	useEffect(() => {
		getAllExamCenters()
			.then((centres) => {
				setExamCentres(centres);
			})
			.catch((error) => {
				console.error("Error fetching exam centres:", error);
				toast.error("Failed to load exam centres");
			});
	}, []);

	return (
		<div className="grid grid-cols-1 grid-rows-[auto_auto_auto] xl:grid-cols-[auto_1fr_auto] xl:grid-rows-[auto_auto] my-4 gap-x-2">
			<h2 className="text-xl font-semibold mb-1 text-black dark:text-white xl:col-span-2">
				Download Results Sheet
			</h2>
			<p className="text-lg max-w-prose col-start-1 xl:col-span-2">
				You can download a CSV file of student's results sheet per stream.
			</p>
			<Select
				onValueChange={(value) => setSelectedStream(value)}
				value={selectedStream === null ? undefined : selectedStream.toString()}
			>
				<SelectTrigger className="w-[180px] mt-2 mb-6 cursor-pointer xl:col-start-1">
					<SelectValue placeholder="Select Stream" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="2">Physical Science</SelectItem>
					<SelectItem value="4">Biological Science</SelectItem>
					<SelectItem value="3">Physical Science (ICT)</SelectItem>
				</SelectContent>
			</Select>

			<Select
				onValueChange={(value) => setSelectedExamCentre(value)}
				value={selectedExamCentre}
			>
				<SelectTrigger className="w-[400px] mt-2 mb-6 cursor-pointer xl:col-start-2">
					<SelectValue placeholder="Select Exam Centre" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="undefined">All</SelectItem>
					{examCentres.map((centre) => (
						<SelectItem key={centre.id} value={centre.id.toString()}>
							{centre.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Button
				className="xl:col-start-3 xl:row-span-2 xl:row-start-1 font-medium"
				size="lg"
				disabled={selectedStream === null}
				onClick={async () => {
					if (selectedStream === null) {
						toast.error("Please select a stream");
						return;
					}
					try {
						toast.loading("Downloading...");
						await Promise.all([
							downloadResultsSheetForStreamAndExamCentre(
								selectedStream,
								selectedExamCentre === "undefined"
									? undefined
									: selectedExamCentre,
							),
							createTimer(),
						]).then(() => {
							toast.dismiss();
							toast.success("Downloaded!");
						});
					} catch (error) {
						toast.dismiss();
						toast.error(
							typeof error === "string" ? error : "Failed to download the file",
						);
					}
				}}
			>
				Download
			</Button>
		</div>
	);
}
