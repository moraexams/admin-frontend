import { Button } from "@/components/ui/button";
import { downloadCentreWiseNameList } from "@/services/nameList.service";
import toast from "react-hot-toast";

export default function DownloadCentreWiseNameList() {
	return (
		<section className="grid grid-cols-1 grid-rows-[auto_auto_auto] xl:grid-cols-[1fr_auto] xl:grid-rows-[auto_auto] my-3">
			<h2 className="text-xl font-semibold mb-1 text-black dark:text-white">
				Download Centre-Wise Name List
			</h2>
			<p className="text-lg mb-3 max-w-prose col-start-1">
				After the verification process is completed, generate the name list to
				be sent to the exam centres.{" "}
			</p>

			<Button
				className="xl:col-start-2 xl:row-span-2 xl:row-start-1 font-medium"
				size="lg"
				onClick={async () => {
					try {
						await downloadCentreWiseNameList();
					} catch (error) {
						toast.error(
							typeof error === "string"
								? error
								: "Failed to generate centre-wise name list",
						);
					}
				}}
			>
				Download
			</Button>
		</section>
	);
}
