import { useState } from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../layout/DefaultLayout";
import { startSendingIndexNoEmails } from "../services/dangerzoneServices";

interface Feedback {
	state: "success" | "error" | "loading";
	message: string;
}

const DangerZone = () => {
	const [feedback, setFeedback] = useState<Feedback | null>(null);
	return (
		<DefaultLayout>
			<Breadcrumb pageName="Danger Zone" />
			<section className="grid grid-cols-1 grid-rows-[auto_auto_auto] xl:grid-cols-[1fr_auto] xl:grid-rows-[auto_auto]">
				<h2 className="text-xl font-semibold mb-1 text-black dark:text-white">
					Send Index No through Emails
				</h2>
				<p className="text-lg mb-3 max-w-prose col-start-1">
					<b className="text-red-600 font-medium">IRREVERSIBLE</b>. After the
					verification process is completed, send the index number of each
					student to their email address.
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
					className={`px-4 py-3 bg-meta-9 rounded-lg text-white font-medium col-start-1 h-fit xl:col-start-2 xl:row-start-1 xl:row-span-2${feedback && feedback.state === "loading" ? " opacity-50 cursor-not-allowed" : ""}`}
					disabled={feedback?.state === "loading"}
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
					{feedback != null && feedback.state === "loading"
						? "Sending..."
						: "Start sending"}
				</button>
			</section>
		</DefaultLayout>
	);
};

export default DangerZone;
