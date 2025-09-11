import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface Props {
	link: string;
}
export default function PreviewPaymentLink(props: Props) {
	const [isLoading, setLoading] = useState(true);

	if (!props.link) {
		return <span>No Payment Link Available</span>;
	}
	let content: React.ReactNode = <></>;

	if (props.link.endsWith(".pdf")) {
		content = (
			<iframe
				src={import.meta.env.VITE_BACKEND_URL.concat(props.link)}
				className="w-full flex-1"
				onLoad={() => {
					setLoading(false);
				}}
				title={"Payment proof"}
			/>
		);
	}
	if (
		props.link.endsWith(".png") ||
		props.link.endsWith(".jpg") ||
		props.link.endsWith(".jpeg")
	) {
		content = (
			<img
				src={import.meta.env.VITE_BACKEND_URL.concat(props.link)}
				alt="Payment Proof"
				onLoad={() => setLoading(false)}
				className="max-h-[500px] object-contain"
			/>
		);
	}

	return (
		<>
			<Skeleton className="h-10 w-full mb-2" hidden={!isLoading} />
			{content}
		</>
	);
}
