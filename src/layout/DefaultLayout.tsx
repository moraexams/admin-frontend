import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
	return (
		<SidebarProvider>
			<Toaster position="top-right" />
			<AppSidebar />
			<main className="flex-[1_0_0] overflow-auto p-3 md:p-5 2xl:p-8">
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
