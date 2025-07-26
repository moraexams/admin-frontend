import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../layout/DefaultLayout";
import {
	downloadAttendanceSheets,
	generateAttendanceSheetPDFs,
} from "../services/attendanceSheetService";
import {
	dangerZonePageData,
	startSendingIndexNoEmails,
} from "../services/dangerzoneServices";

interface Feedback {
	state: "success" | "error" | "loading";
	message: string;
}

interface DangerZoneConstants {
	students_index_no_sending_process_started: string;
	latest_git_commit: string;
	build_time: string;
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
			<p className="font-bold text-lg">
				This page includes actions that are irreversible.
			</p>

			<p className="mb-8 text-lg">
				You are using{" "}
				<a
					className="underline text-blue-500 dark:text-blue-300"
					href={`https://github.com/moraexams/admin-frontend/commit/${import.meta.env.LATEST_GIT_COMMIT}`}
					target="_blank"
					rel="noreferrer"
				>
					admin-frontend @{import.meta.env.LATEST_GIT_COMMIT.slice(0, 6)}
				</a>{" "}
				built on{" "}
				<time dateTime={import.meta.env.BUILD_TIME} className="underline">
					{new Date(import.meta.env.BUILD_TIME).toLocaleString("en-LK", {
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
					})}
				</time>
				{constants?.latest_git_commit ? (
					<>
						{" "}
						connected to{" "}
						<a
							className="underline text-blue-500 dark:text-blue-300"
							href={`https://github.com/moraexams/backend/commit/${constants.latest_git_commit}`}
							target="_blank"
							rel="noreferrer"
						>
							backend @{constants.latest_git_commit.slice(0, 6)}
						</a>
						{constants?.build_time ? (
							<>
								{" "}
								built on{" "}
								<time dateTime={constants?.build_time} className="underline">
									{new Date(constants?.build_time).toLocaleString("en-LK", {
										year: "numeric",
										month: "2-digit",
										day: "2-digit",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</time>
							</>
						) : null}
					</>
				) : null}
				.
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
					Can be re-generate and download. After the verification process is
					completed, generate the attendance sheets for the exam centres.{" "}
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
					disabled={constants == null || feedback?.state === "loading"}
					onClick={async () => {
						try {
							await generateAttendanceSheetPDFs();
							toast.success("Generating PDF process started!");
							setFeedback(null);
						} catch (error) {
							toast.error(
								typeof error === "string"
									? error
									: "Failed to generate attendance sheets",
							);
							setFeedback(null);
						}
					}}
				>
					{"Generate"}
				</button>
			</section>

			<section className="grid grid-cols-1 grid-rows-[auto_auto_auto] xl:grid-cols-[1fr_auto] xl:grid-rows-[auto_auto] my-3">
				<h2 className="text-xl font-semibold mb-1 text-black dark:text-white">
					Download the generated PDFs
				</h2>
				<p className="text-lg mb-3 max-w-prose col-start-1">
					After the generation of PDF process is completed, download the zip
					file of attendance sheets for the exam centres.{" "}
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
					disabled={constants == null || feedback?.state === "loading"}
					onClick={async () => {
						try {
							await downloadAttendanceSheets();
							toast.success("Downloading process started!");
							setFeedback(null);
						} catch (error) {
							toast.error(
								typeof error === "string" ? error : "Failed to download PDFs",
							);
							setFeedback(null);
						}
					}}
				>
					{"Download"}
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
