import {
	ROLE_DISTRICTS_COORDINATOR,
	ROLE_EXAM_COORDINATOR,
	ROLE_FINANCE_TEAM_MEMBER,
	ROLE_TECH_COORDINATOR,
	ROLE_TECH_TEAM_MEMBER,
	ROLE_TREASURER,
} from "@/common/roles";
import { snakeCaseToNormalCase } from "@/common/utils";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	LOCAL_STORAGE_ASSOCIATED_DISTRICT,
	LOCAL_STORAGE__ROLE,
	LOCAL_STORAGE__TOKEN,
	LOCAL_STORAGE__USER,
	LOCAL_STORAGE__USERNAME,
	LOCAL_STORAGE__USER_ID,
} from "@/services/authServices";
import type { LocalStorage_User } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import {
	AlertTriangle,
	Banknote,
	BarChart2,
	BookOpen,
	ChevronRight,
	ClipboardList,
	FileText,
	Home,
	ListOrdered,
	LogOut,
	type LucideIcon,
	Map as MapIcon,
	NotepadText,
	PanelLeftIcon,
	User,
	UserPlus,
	UserX,
	Users,
	Wallet,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

interface SidebarItemLink {
	type: "link";
	url: string;
	title: string;
	icon: LucideIcon;
	hideIf?: (role: string) => boolean;
}

interface SidebarItemGroup {
	type: "group";
	title: string;
	icon: LucideIcon;
	links: Array<SidebarItemLink>;
	hideIf?: (role: string) => boolean;
	activePrefix: string;
}

const items: Array<SidebarItemLink | SidebarItemGroup> = [
	{
		type: "link",
		title: "Dashboard",
		url: "/",
		icon: Home,
	},
	{
		type: "group",
		title: "Marks",
		icon: Wallet,
		activePrefix: "/marks",
		links: [
			{
				type: "link",
				title: "Dashboard",
				url: "/marks",
				icon: Home,
			},
			{
				type: "link",
				title: "Boundaries",
				url: "/marks/boundaries",
				icon: ListOrdered,
				hideIf: (role) =>
					typeof role !== "string" ||
					![ROLE_TECH_COORDINATOR, ROLE_EXAM_COORDINATOR].includes(role),
			},
			{
				type: "link",
				title: "Centre-Wise Marks",
				url: "/marks/centre-wise",
				icon: NotepadText,
			},
			{
				type: "link",
				title: "All Marks",
				url: "/marks/all",
				icon: NotepadText,
				hideIf: (role) => role !== ROLE_TECH_COORDINATOR,
			},
		],
	},
	{
		type: "group",
		title: "Finance",
		icon: Wallet,
		activePrefix: "/finance",
		hideIf: (role) =>
			typeof role !== "string" ||
			![
				ROLE_TECH_COORDINATOR,
				ROLE_TREASURER,
				ROLE_FINANCE_TEAM_MEMBER,
			].includes(role),
		links: [
			{
				type: "link",
				title: "Dashboard",
				url: "/finance/dashboard",
				icon: Home,
			},
			{
				type: "link",
				title: "Transaction Categories",
				url: "/finance/transaction-categories",
				icon: ClipboardList,
			},
			{
				type: "link",
				title: "Add Transaction",
				url: "/finance/add-transaction",
				icon: Wallet,
			},
			{
				type: "link",
				title: "All Transactions",
				url: "/finance/transactions",
				icon: FileText,
			},
			{
				type: "link",
				title: "District Expenses",
				url: "/finance/districts",
				icon: MapIcon,
			},
			{
				type: "link",
				title: "Bill Gallery",
				url: "/finance/billgallery",
				icon: FileText,
			},
			{
				type: "link",
				title: "Coordinator Payments",
				url: "/finance/coordinator-payments",
				icon: Banknote,
			},
		],
	},
	{
		type: "group",
		title: "Stats",
		icon: BarChart2,
		activePrefix: "/stats",
		links: [
			{
				type: "link",
				title: "Centre Wise Students",
				url: "/stats/students/centre-wise",
				icon: MapIcon,
			},
			{
				type: "link",
				title: "Entered Marks",
				url: "/stats/enteredmarks",
				icon: BookOpen,
			},
			{
				type: "link",
				title: "District Wise Registrations",
				url: "/stats/student-registrations/district-wise",
				icon: MapIcon,
			},
			{
				type: "link",
				title: "Centre Wise Registrations",
				url: "/stats/student-registrations/centre-wise",
				icon: MapIcon,
			},
		],
	},
	{
		type: "group",
		title: "Districts",
		icon: MapIcon,
		activePrefix: "/districts",
		hideIf: (role) =>
			typeof role !== "string" ||
			![ROLE_TECH_COORDINATOR, ROLE_DISTRICTS_COORDINATOR].includes(role),
		links: [
			{
				type: "link",
				title: "Overview",
				url: "/districts/overview",
				icon: MapIcon,
			},
			// {
			// 	type: "link",
			// 	title: "Districts",
			// 	url: "/districts",
			// 	icon: Map,
			// },
			// {
			// 	type: "link",
			// 	title: "Exam Centres",
			// 	url: "/district/centres",
			// 	icon: Home,
			// },
			{
				type: "link",
				title: "Coordinators",
				url: "/district/coordinators",
				icon: Users,
			},
		],
	},
	{
		type: "group",
		title: "Paper Distribution",
		icon: FileText,
		activePrefix: "/distribution",
		links: [
			{
				type: "link",
				title: "Table View",
				url: "/distribution/table",
				icon: FileText,
			},
			{
				type: "link",
				title: "Details View",
				url: "/distribution/card",
				icon: FileText,
			},
		],
	},
	{
		type: "group",
		title: "Students",
		icon: Users,
		activePrefix: "/students",
		links: [
			{
				type: "link",
				title: "Add Students",
				url: "/students/add",
				icon: UserPlus,
				hideIf: (role) =>
					typeof role !== "string" ||
					![ROLE_TECH_COORDINATOR, ROLE_TECH_TEAM_MEMBER].includes(role),
			},
			{
				type: "link",
				title: "Registrations",
				url: "/students/registrations",
				icon: UserX,
			},
			{
				type: "link",
				title: "Verified Students",
				url: "/students/verified",
				icon: Users,
			},
			{
				type: "link",
				title: "Rejected Students",
				url: "/students/rejected",
				icon: Users,
			},
		],
	},
	{
		type: "link",
		title: "Users",
		url: "/users",
		icon: Users,
		hideIf: (role) =>
			typeof role !== "string" || ROLE_TECH_COORDINATOR !== role,
	},
	{
		type: "link",
		title: "Audit Logs",
		url: "/audit-logs",
		icon: FileText,
		hideIf: (role) =>
			typeof role !== "string" || ROLE_TECH_COORDINATOR !== role,
	},
	{
		type: "link",
		title: "Danger Zone",
		url: "/danger-zone",
		icon: AlertTriangle,
		hideIf: (role) =>
			typeof role !== "string" || ROLE_TECH_COORDINATOR !== role,
	},
];

export function AppSidebar() {
	const { toggleSidebar, isMobile, state, setOpen, setOpenMobile } =
		useSidebar();
	const navigate = useNavigate();
	const [openGroup, setOpenGroup] = useState<string | null>(null);
	const openGroupRef = useRef<HTMLDivElement | null>(null);
	const userStringified = localStorage.getItem(LOCAL_STORAGE__USER);
	const user: LocalStorage_User | null = userStringified
		? JSON.parse(userStringified)
		: null;
	const role = localStorage.getItem(LOCAL_STORAGE__ROLE) || "";

	const closeSidebar = () => {
		setOpenGroup(null);
		if (isMobile) {
			setOpenMobile(false);
			return;
		}

		setOpen(false);
	};

	const getVisibleGroupLinks = (
		item: Extract<(typeof items)[number], { type: "group" }>,
	) => item.links.filter((link) => !link.hideIf?.(role));

	useEffect(() => {
		if (state !== "collapsed") {
			setOpenGroup(null);
		}
	}, [state]);

	useEffect(() => {
		const handlePointerDown = (event: PointerEvent) => {
			if (!openGroupRef.current) return;
			if (!(event.target instanceof Node)) return;
			if (openGroupRef.current.contains(event.target)) return;
			setOpenGroup(null);
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpenGroup(null);
			}
		};

		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const logout = () => {
		localStorage.removeItem(LOCAL_STORAGE__TOKEN);
		localStorage.removeItem(LOCAL_STORAGE__USER);
		localStorage.removeItem(LOCAL_STORAGE__USERNAME);
		localStorage.removeItem(LOCAL_STORAGE__USER_ID);
		localStorage.removeItem(LOCAL_STORAGE__ROLE);
		localStorage.removeItem(LOCAL_STORAGE_ASSOCIATED_DISTRICT);
		navigate("/sign-in");
	};

	return (
		<Sidebar collapsible="icon">
			<SidebarContent className="gap-0">
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton className="border cursor-default hover:bg-inherit mb-2 h-fit">
								{user ? (
									<>
										<User />
										<div className="flex flex-col">
											<span className="font-medium">{user.username}</span>
											<span className="text-xs">
												{snakeCaseToNormalCase(user.role)}
											</span>
										</div>
									</>
								) : null}
							</SidebarMenuButton>
						</SidebarMenuItem>
						{items.map((item) =>
							item.type !== "link" || item.hideIf?.(role) ? null : (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={item.url === window.location.pathname}
										tooltip={item.title}
									>
										<NavLink to={item.url} onClick={closeSidebar}>
											<item.icon size={25} className="size-40" />
											<span>{item.title}</span>
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							),
						)}
					</SidebarMenu>
				</SidebarGroup>

				{items.map((item) =>
					item.type !== "group" || item.hideIf?.(role) ? null : (
						<SidebarGroup key={item.title}>
							<SidebarMenu>
								<Collapsible
									className="group/collapsible"
									defaultOpen={window.location.pathname.startsWith(
										item.activePrefix,
									)}
								>
									<SidebarMenuItem>
										{state === "collapsed" ? (
											<div
												ref={
													openGroup === item.title ? openGroupRef : undefined
												}
												className="relative"
											>
														<SidebarMenuButton
													tooltip={item.title}
													isActive={window.location.pathname.startsWith(
														item.activePrefix,
													)}
													onClick={() =>
														setOpenGroup(
															openGroup === item.title ? null : item.title,
														)
													}
												>
													<item.icon size={25} className="size-40" />
													<span>{item.title}</span>
												</SidebarMenuButton>
												{openGroup === item.title ? (
													<div className="absolute left-full top-0 z-50 ml-2 w-64 rounded-xl border border-white/10 bg-black p-2 shadow-2xl">
														<div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/60">
															{item.title}
														</div>
														<div className="flex flex-col gap-1">
															{getVisibleGroupLinks(item).map((link) => (
																<NavLink
																	key={link.title}
																	to={link.url}
																	onClick={closeSidebar}
																	aria-label={link.title}
																	className={({ isActive }) =>
																		`group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 ${
																			isActive ? "bg-gray-800" : ""
																		}`
																	}
																>
																	<link.icon size={18} className="shrink-0" />
																	<span>{link.title}</span>
																</NavLink>
															))}
														</div>
													</div>
												) : null}
											</div>
										) : (
											<CollapsibleTrigger asChild>
												<SidebarMenuButton>
													<item.icon size={25} className="size-40" />
													{item.title}
													<ChevronRight className="ml-auto duration-200 transition-transform group-data-[state=open]/collapsible:rotate-90" />
												</SidebarMenuButton>
											</CollapsibleTrigger>
										)}
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.links.map((link) =>
													link?.hideIf?.(role) ? null : (
														<SidebarMenuSubItem key={link.title}>
															<SidebarMenuSubButton
																asChild
																isActive={link.url === window.location.pathname}
															>
																<NavLink to={link.url} onClick={closeSidebar}>
																	<link.icon size={25} className="size-40" />
																	<span>{link.title}</span>
																</NavLink>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													),
												)}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							</SidebarMenu>
						</SidebarGroup>
					),
				)}
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="text-destructive hover:text-destructive"
							tooltip="Log Out"
							onClick={logout}
						>
							<LogOut />
							<span>Log Out</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="cursor-pointer"
							tooltip="Hide"
							onClick={toggleSidebar}
						>
							<PanelLeftIcon />
							<span>Hide</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
