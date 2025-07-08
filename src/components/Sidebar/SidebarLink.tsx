import type { PropsWithChildren } from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";

interface Props extends NavLinkProps {
	to: string;
	isActive?: boolean;
}
export default function SidebarLink(props: PropsWithChildren<Props>) {
	let { to, isActive, ...otherProps } = props;

	if (isActive === undefined) {
		isActive = window.location.pathname === to;
	}

	return (
		<NavLink
			to={to}
			className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 text-white ${
				isActive ? "bg-graydark text-white dark:bg-meta-4" : ""
			}`}
			{...otherProps}
		>
			{props.children}
		</NavLink>
	);
}
