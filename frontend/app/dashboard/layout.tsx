import DashboardNavigationBar from "@/components/dashboard_components/DashboardNavigationBar";
import Header from "@/components/dashboard_components/Header";
import { ReactNode } from "react";

export default function DashBoardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <section className="flex flex-col w-full h-dvh overflow-hidden font-grotesque bg-[#fefefe]">

            <Header />

            <section className="flex flex-row gap-5 items-stretch flex-1 min-h-0 overflow-hidden font-grotesque bg-[#fefefe]">

                <aside className="w-full max-w-96 shrink-0 h-full overflow-hidden">
                    <DashboardNavigationBar />
                </aside>

                <main className="min-w-0 flex-1 h-full overflow-y-auto py-6 px-5">
                    {children}
                </main>

            </section>

        </section>
    );
}