import { useEffect, useRef, useState } from "react";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import DarkLogo from "../../images/logo/logo-dark.png";
import SidebarLink from "./SidebarLink";
import SidebarLinkGroup from "./SidebarLinkGroup";
import SidebarSubLink from "./SidebarSubLink";

interface SidebarProps {
	sidebarOpen: boolean;
	setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
	const location = useLocation();
	const { pathname } = location;

	const trigger = useRef<HTMLButtonElement | null>(null);
	const sidebar = useRef<HTMLElement | null>(null);

	const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
	const [sidebarExpanded, setSidebarExpanded] = useState(
		storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
	);
	const role = localStorage.getItem("role");

	useEffect(() => {
		const clickHandler = ({ target }: MouseEvent) => {
			if (
				!sidebar.current ||
				!trigger.current ||
				!(target instanceof HTMLElement)
			)
				return;
			if (
				!sidebarOpen ||
				sidebar.current.contains(target) ||
				trigger.current.contains(target)
			)
				return;
			setSidebarOpen(false);
		};
		document.addEventListener("click", clickHandler);
		return () => document.removeEventListener("click", clickHandler);
	});

	// close if the esc key is pressed
	useEffect(() => {
		const keyHandler = ({ keyCode }: KeyboardEvent) => {
			if (!sidebarOpen || keyCode !== 27) return;
			setSidebarOpen(false);
		};
		document.addEventListener("keydown", keyHandler);
		return () => document.removeEventListener("keydown", keyHandler);
	});

	return (
		<aside
			ref={sidebar}
			className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
				sidebarOpen ? "translate-x-0" : "-translate-x-full"
			}`}
		>
			{/* <!-- SIDEBAR HEADER --> */}
			<div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
				<NavLink to="/">
					{/* <img className="hidden dark:block h-40" src={DarkLogo} alt="Logo" /> */}
					<img className="w-auto" src={DarkLogo} alt="Logo" />
				</NavLink>

				<button
					type="button"
					ref={trigger}
					onClick={() => setSidebarOpen(!sidebarOpen)}
					aria-controls="sidebar"
					aria-expanded={sidebarOpen}
					className="block lg:hidden"
				>
					<svg
						className="fill-current"
						width="20"
						height="18"
						viewBox="0 0 20 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
							fill=""
						/>
					</svg>
				</button>
			</div>
			{/* <!-- SIDEBAR HEADER --> */}

			<div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
				{/* <!-- Sidebar Menu --> */}
				<nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
					{/* <!-- Menu Group --> */}
					<div>
						<h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
							MENU
						</h3>

						<ul className="mb-6 flex flex-col gap-1.5">
							<li>
								<SidebarLink to="/">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
										/>
									</svg>
									Dashboard
								</SidebarLink>
							</li>
							{typeof role === "string" &&
								[
									"TECH_COORDINATOR",
									"TREASURER",
									"FINANCE_TEAM_MEMBER",
								].includes(role) && (
									<ul className="flex flex-col gap-1.5">
										<SidebarLinkGroup
											activeCondition={pathname.startsWith("/finance")}
										>
											{(handleClick, open) => {
												return (
													<React.Fragment>
														<SidebarLink
															to="/finance"
															onClick={(e) => {
																e.preventDefault();
																handleClick();
																setSidebarExpanded(!sidebarExpanded);
															}}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																strokeWidth={1.5}
																stroke="currentColor"
																className="size-6"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
																/>
															</svg>
															Finance
															<svg
																className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
																	open && "rotate-180"
																}`}
																width="20"
																height="20"
																viewBox="0 0 20 20"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	fillRule="evenodd"
																	clipRule="evenodd"
																	d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
																	fill=""
																/>
															</svg>
														</SidebarLink>
														<div
															className={`translate transform overflow-hidden ${!open && "hidden"}`}
														>
															<ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
																<SidebarSubLink to="/finance/dashboard">
																	Dashboard
																</SidebarSubLink>
																<SidebarSubLink to="/finance/transaction-categories">
																	Transaction Categories
																</SidebarSubLink>
																<SidebarSubLink to="/finance/add-transaction">
																	Add Transaction
																</SidebarSubLink>
																<SidebarSubLink to="/finance/transactions">
																	All Transactions
																</SidebarSubLink>
																<SidebarSubLink to="/finance/districts">
																	District Expenses
																</SidebarSubLink>
																<SidebarSubLink to="/finance/billgallery">
																	Bill Gallery
																</SidebarSubLink>
															</ul>
														</div>
													</React.Fragment>
												);
											}}
										</SidebarLinkGroup>
									</ul>
								)}
							<ul className="flex flex-col gap-1.5">
								<SidebarLinkGroup
									activeCondition={
										pathname === "/stats" || pathname.includes("stats")
									}
								>
									{(handleClick, open) => {
										return (
											<React.Fragment>
												<SidebarLink
													to="/stats"
													onClick={(e) => {
														e.preventDefault();
														handleClick();
														setSidebarExpanded(!sidebarExpanded);
													}}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth={1.5}
														stroke="currentColor"
														className="size-6"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
														/>
													</svg>
													Stats
													<svg
														className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"}`}
														width="20"
														height="20"
														viewBox="0 0 20 20"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															fillRule="evenodd"
															clipRule="evenodd"
															d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
															fill=""
														/>
													</svg>
												</SidebarLink>
												<div
													className={`translate transform overflow-hidden ${!open && "hidden"}`}
												>
													<ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
														<SidebarSubLink to="/stats/enteredmarks">
															Entered Marks
														</SidebarSubLink>
													</ul>
												</div>
											</React.Fragment>
										);
									}}
								</SidebarLinkGroup>
							</ul>
							{typeof role === "string" &&
								["TECH_COORDINATOR"].includes(role) && (
									<li>
										<SidebarLink to="/users">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
												/>
											</svg>
											Users
										</SidebarLink>
									</li>
								)}

							{/* <!-- Menu Item Users --> */}

							{typeof role === "string" &&
								["TECH_COORDINATOR", "DISTRICTS_COORDINATOR"].includes(
									role,
								) && (
									<ul className="flex flex-col gap-1.5">
										{/* <!-- Menu Item Auth Pages --> */}
										<SidebarLinkGroup
											activeCondition={
												pathname === "/districts" ||
												pathname.startsWith("/district/")
											}
										>
											{(handleClick, open) => {
												return (
													<React.Fragment>
														<SidebarLink
															to="/districts"
															onClick={(e) => {
																e.preventDefault();
																handleClick();
																setSidebarExpanded(!sidebarExpanded);
															}}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																strokeWidth={1.5}
																stroke="currentColor"
																className="size-6"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
																/>
															</svg>
															District
															<svg
																className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
																	open && "rotate-180"
																}`}
																width="20"
																height="20"
																viewBox="0 0 20 20"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	fillRule="evenodd"
																	clipRule="evenodd"
																	d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
																	fill=""
																/>
															</svg>
														</SidebarLink>
														<div
															className={`translate transform overflow-hidden ${!open && "hidden"}`}
														>
															<ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
																<SidebarSubLink to="/districts">
																	Districts
																</SidebarSubLink>
																<SidebarSubLink to="/district/centres">
																	Exam Centres
																</SidebarSubLink>
																<SidebarSubLink to="/district/coordinators">
																	Coordinators
																</SidebarSubLink>
															</ul>
														</div>
													</React.Fragment>
												);
											}}
										</SidebarLinkGroup>
									</ul>
								)}

							<ul className="flex flex-col gap-1.5">
								<SidebarLinkGroup
									activeCondition={
										pathname === "/distribution" ||
										pathname.includes("distribution")
									}
								>
									{(handleClick, open) => {
										return (
											<React.Fragment>
												<SidebarLink
													to="/distribution"
													onClick={(e) => {
														e.preventDefault();
														handleClick();
														setSidebarExpanded(!sidebarExpanded);
													}}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth={1.5}
														stroke="currentColor"
														className="size-6"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zM6 6h12M6 10h12M6 14h12M6 18h12"
														/>
													</svg>
													Paper Distribution
													<svg
														className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"}`}
														width="20"
														height="20"
														viewBox="0 0 20 20"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															fillRule="evenodd"
															clipRule="evenodd"
															d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
															fill=""
														/>
													</svg>
												</SidebarLink>
												<div
													className={`translate transform overflow-hidden ${!open && "hidden"}`}
												>
													<ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
														<SidebarSubLink to="/distribution/table">
															Table View
														</SidebarSubLink>
														<SidebarSubLink to="/distribution/card">
															Details View
														</SidebarSubLink>
													</ul>
												</div>
											</React.Fragment>
										);
									}}
								</SidebarLinkGroup>
							</ul>

							<ul className="flex flex-col gap-1.5">
								<SidebarLinkGroup
									activeCondition={
										pathname === "/students" || pathname.includes("students")
									}
								>
									{(handleClick, open) => {
										return (
											<React.Fragment>
												<SidebarLink
													to="/students"
													onClick={(e) => {
														e.preventDefault();
														handleClick();
														setSidebarExpanded(!sidebarExpanded);
													}}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth={1.5}
														stroke="currentColor"
														className="size-6"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
														/>
													</svg>
													Students
													<svg
														className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"}`}
														width="20"
														height="20"
														viewBox="0 0 20 20"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															fillRule="evenodd"
															clipRule="evenodd"
															d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
															fill=""
														/>
													</svg>
												</SidebarLink>
												<div
													className={`translate transform overflow-hidden ${!open && "hidden"}`}
												>
													<ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
														<SidebarSubLink to="/students/add">
															Add Student
														</SidebarSubLink>
														<SidebarSubLink to="/students/verify">
															Verify Student
														</SidebarSubLink>
														<SidebarSubLink to="/students/unverified">
															Unverified Students
														</SidebarSubLink>
														<SidebarSubLink to="/students/centre">
															Centre Wise
														</SidebarSubLink>
														<SidebarSubLink to="/students/all">
															All Students
														</SidebarSubLink>
													</ul>
												</div>
											</React.Fragment>
										);
									}}
								</SidebarLinkGroup>
							</ul>
							<li>
								<SidebarLink to="/marks">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="size-6"
									>
										<path
											fillRule="evenodd"
											d="M11.097 1.515a.75.75 0 0 1 .589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 1 1 1.47.294L16.665 7.5h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.2 6h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103H3.75a.75.75 0 0 1 0-1.5h3.885l1.2-6H5.25a.75.75 0 0 1 0-1.5h3.885l1.08-5.397a.75.75 0 0 1 .882-.588ZM10.365 9l-1.2 6h4.47l1.2-6h-4.47Z"
											clipRule="evenodd"
										/>
									</svg>
									Marks
								</SidebarLink>
							</li>
							<li>
								<SidebarLink to="/studentmarks">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
										/>
									</svg>
									Student Marks
								</SidebarLink>
							</li>
							{role === "TECH_COORDINATOR" ? (
								<>
									<li>
										<SidebarLink to="/audit-logs">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="icon icon-tabler icons-tabler-outline icon-tabler-logs"
											>
												<path stroke="none" d="M0 0h24v24H0z" fill="none" />
												<path d="M4 12h.01" />
												<path d="M4 6h.01" />
												<path d="M4 18h.01" />
												<path d="M8 18h2" />
												<path d="M8 12h2" />
												<path d="M8 6h2" />
												<path d="M14 6h6" />
												<path d="M14 12h6" />
												<path d="M14 18h6" />
											</svg>
											Audit Logs
										</SidebarLink>
									</li>
									<li>
										<SidebarLink to="/danger-zone">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="icon icon-tabler icons-tabler-filled icon-tabler-alert-triangle"
											>
												<path stroke="none" d="M0 0h24v24H0z" fill="none" />
												<path d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
											</svg>
											Danger Zone
										</SidebarLink>
									</li>
								</>
							) : null}
						</ul>
					</div>
				</nav>
				{/* <!-- Sidebar Menu --> */}
			</div>
		</aside>
	);
};

export default Sidebar;
