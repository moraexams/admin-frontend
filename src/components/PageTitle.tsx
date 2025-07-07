import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageTitleProps {
	title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
	const location = useLocation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: location is a required dependency here
	useEffect(() => {
		document.title = title;
	}, [location, title]);

	return null;
};

export default PageTitle;
