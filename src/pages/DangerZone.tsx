import { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../layout/DefaultLayout";
import {
	dangerZonePageData,
	startSendingIndexNoEmails,
} from "../services/dangerzoneServices";
import { downloadAttendanceSheets, generateAttendanceSheetPDFs } from "../services/attendanceSheetService";
import toast from 'react-hot-toast';

interface Feedback {
	state: "success" | "error" | "loading";
	message: string;
}

interface DangerZoneConstants {
	students_index_no_sending_process_started: string;
}

const DangerZone = () => {
	const [feedback, setFeedback] = useState<Feedback | null>(null);
	const [constants, setConstants] = useState<DangerZoneConstants | null>(null);

	useEffect(() => {
		dangerZonePageData()
			.then((data) => {
				setConstants(data.constants);
			})
			.catch(console.error);
	}, []);

	return (
		<DefaultLayout>
			<Breadcrumb pageName="Danger Zone" />
			<p className="mb-8 font-bold text-lg">
				This page includes actions that are irreversible.
			</p>

			<section className="grid grid-cols-1 grid-rows-[auto_auto_auto] xl:grid-cols-[1fr_auto] xl:grid-rows-[auto_auto] my-3">
				<h2 className="text-xl font-semibold mb-1 text-black dark:text-white">
					Send Index No through Emails
				</h2>
				<p className="text-lg mb-3 max-w-prose col-start-1">
					<b className="text-red-600 font-medium">IRREVERSIBLE</b>. After the
					verification process is completed, send the index number of each
					student to their email address.{" "}
					{feedback == null || feedback.state === "loading" ? null : (
						<span
							className={`block ${feedback.state === "success" ? "text-green-500" : "text-red-500"}`}
						>
							{feedback.message}
						</span>
					)}
				</p>
				<button
					type="button"
					className={
						"px-4 py-3 bg-meta-9 rounded-lg text-white font-medium col-start-1 h-fit xl:col-start-2 xl:row-start-1 xl:row-span-2 disabled:bg-meta-9/50 disabled:hover:bg-meta-9/50 disabled:cursor-not-allowed hover:bg-meta-9/60 transition-colors"
					}
					disabled={
						constants == null ||
						constants.students_index_no_sending_process_started === "true" ||
						feedback?.state === "loading"
					}
					onClick={async () => {
						setFeedback({
							state: "loading",
							message: "Sending emails...",
						});

						try {
							await startSendingIndexNoEmails();
							setFeedback({
								state: "success",
								message: "Emails sent successfully!",
							});
						} catch (error) {
							if (typeof error === "string") {
								setFeedback({ state: "error", message: error });
								setTimeout(() => {
									setFeedback(null);
								}, 2000);
							}
						}
					}}
				>
					{constants?.students_index_no_sending_process_started === "true"
						? "Already started"
						: feedback != null && feedback.state === "loading"
							? "Sending..."
							: "Start sending"}
				</button>
			</section>


			<section className="grid grid-cols-1 grid-rows-[auto_auto_auto] xl:grid-cols-[1fr_auto] xl:grid-rows-[auto_auto] my-3">
				<h2 className="text-xl font-semibold mb-1 text-black dark:text-white">
					Generate the Attendance sheets
				</h2>
				<p className="text-lg mb-3 max-w-prose col-start-1">
					Can be re-generate and download. 
					 After the verification process is completed, generate the attendance sheets for the exam centres.{" "}
					{feedback == null || feedback.state === "loading" ? null : (
						<span
							className={`block ${feedback.state === "success" ? "text-green-500" : "text-red-500"}`}
						>
							{feedback.message}
						</span>
					)}
				</p>
				<button
					type="button"
					className={
						"px-4 py-3 bg-meta-9 rounded-lg text-white font-medium col-start-1 h-fit xl:col-start-2 xl:row-start-1 xl:row-span-2 disabled:bg-meta-9/50 disabled:hover:bg-meta-9/50 disabled:cursor-not-allowed hover:bg-meta-9/60 transition-colors"
					}
					disabled={
						constants == null ||
						feedback?.state === "loading"
					}
					onClick={async () => {
						const toastId = toast.loading("Generating PDFs....");
						{toastId}
						// Dismiss after 2 minutes (120000 ms)
						setTimeout(() => {
							toast.dismiss(toastId);
						}, 120000);

						try {
							await generateAttendanceSheetPDFs();
							toast.success("Generating PDF process started!");
							setFeedback(null);
						} catch (error) {
							toast.error(typeof error === "string" ? error : "Failed to generate attendance sheets");
							setFeedback(null);
						}
					}}
				>
					{"Generate"}
				</button>
			</section>

			

			<section className="grid grid-cols-1 grid-rows-[auto_auto_auto] xl:grid-cols-[1fr_auto] xl:grid-rows-[auto_auto] my-3">
				<h2 className="text-xl font-semibold mb-1 text-black dark:text-white">
					Finalise Results
				</h2>
				<p className="text-lg mb-3 max-w-prose col-start-1">
					<b className="text-red-600 font-medium">IRREVERSIBLE</b>. After
					setting the marks boundaries for each subject, finalize the results.
					Then only the students can view their results.{" "}
					{feedback == null || feedback.state === "loading" ? null : (
						<span
							className={`block ${feedback.state === "success" ? "text-green-500" : "text-red-500"}`}
						>
							{feedback.message}
						</span>
					)}
				</p>

				<button
					type="button"
					className="px-4 py-3 bg-meta-9 rounded-lg text-white font-medium col-start-1 h-fit xl:col-start-2 xl:row-start-1 xl:row-span-2 disabled:bg-meta-9/50 disabled:hover:bg-meta-9/50 disabled:cursor-not-allowed hover:bg-meta-9/60 transition-colors"
				>
					Finalize
				</button>
			</section>
		</DefaultLayout>
	);
};

export default DangerZone;
