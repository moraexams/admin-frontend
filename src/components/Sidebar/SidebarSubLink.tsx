import type { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";

interface Props {
	to: string;
}
export default function SidebarSubLink(props: PropsWithChildren<Props>) {
	return (
		<li>
			<NavLink
				to={props.to}
				className={({ isActive }) =>
					`group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:underline ${isActive ? "underline" : ""}`
				}
			>
				{props.children}
			</NavLink>
		</li>
	);
}
