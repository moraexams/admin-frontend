import type { PropsWithChildren } from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";

interface Props extends NavLinkProps {
	to: string;
	isActive?: boolean;
}
export default function SidebarLink(props: PropsWithChildren<Props>) {
	const { to, isActive, ...otherProps } = props;
	return (
		<NavLink
			to={props.to}
			className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
				props.isActive ? "bg-graydark text-white dark:bg-meta-4" : ""
			}`}
			{...otherProps}
		>
			{props.children}
		</NavLink>
	);
}
