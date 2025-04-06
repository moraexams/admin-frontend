import type { SnackBarConfig } from "../types/snackbar";

export default function Snackbar({ config }: { config: SnackBarConfig }) {
	return (
		<div
			className={`fixed bottom-10 left-1/2 z-999999 transition-transform duration-500 ease-in-out transform 
                        ${config.show ? "translate-y-0" : "translate-y-40"} 
                        ${config.type ? "bg-green-500" : "bg-red-500"} 
                        text-white flex px-30 py-2 rounded-md shadow-lg -translate-x-1/2`}
		>
			{config.type ? (
				<svg
					className="h-6 w-6 mr-2"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12l2 2 4-4M6 12a6 6 0 1112 0 6 6 0 01-12 0z"
					/>
				</svg>
			) : (
				<svg
					className="h-6 w-6 mr-2"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 9v3m0 3h.01M21.5 12a9.5 9.5 0 11-19 0 9.5 9.5 0 0119 0z"
					/>
				</svg>
			)}
			<span>{config.message}</span>
		</div>
	);
}
