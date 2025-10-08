import {
	ROLE_DISTRICTS_COORDINATOR,
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
import {
	AlertTriangle,
	Banknote,
	BarChart2,
	BookOpen,
	ChevronRight,
	ClipboardList,
	FileText,
	Home,
	LogOut,
	type LucideIcon,
	Map as MapIcon,
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
			// {
			// 	type: "link",
			// 	title: "Centre Wise",
			// 	url: "/students/centre",
			// 	icon: MapIcon,
			// },
		],
	},
	{
		type: "link",
		title: "Marks",
		url: "/marks",
		icon: BookOpen,
	},
	{
		type: "link",
		title: "Student Marks",
		url: "/studentmarks",
		icon: BookOpen,
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
	const { toggleSidebar } = useSidebar();
	const navigate = useNavigate();
	const userStringified = localStorage.getItem(LOCAL_STORAGE__USER);
	const user: LocalStorage_User | null = userStringified
		? JSON.parse(userStringified)
		: null;
	const role = localStorage.getItem(LOCAL_STORAGE__ROLE) || "";

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
									>
										<NavLink to={item.url}>
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
										<CollapsibleTrigger asChild>
											<SidebarMenuButton>
												<item.icon size={25} className="size-40" />
												{item.title}
												<ChevronRight className="ml-auto duration-200 transition-transform group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.links.map((link) =>
													link?.hideIf?.(role) ? null : (
														<SidebarMenuSubItem key={link.title}>
															<SidebarMenuSubButton
																asChild
																isActive={link.url === window.location.pathname}
															>
																<NavLink to={link.url}>
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
							onClick={logout}
						>
							<LogOut />
							<span>Log Out</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="cursor-pointer"
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
