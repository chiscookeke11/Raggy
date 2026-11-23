
import DashboardNavigationBar from "@/components/dashboard_components/DashboardNavigationBar";
import Header from "@/components/dashboard_components/Header";
import { ReactNode } from "react";

export default function DashBoardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <>
            {/* Mobile and smaller screens */}
            <section className="lg:hidden flex h-dvh w-full items-center justify-center bg-[#fefefe] px-6">
                <div className="max-w-sm text-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Desktop Experience Required
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        The Raggy dashboard is currently optimized for larger
                        screens. Please access it using a desktop or laptop
                        for the best experience.
                    </p>
                </div>
            </section>

            {/* Desktop dashboard */}
            <section className="hidden lg:flex flex-col w-full h-dvh overflow-hidden font-grotesque bg-[#fefefe]">
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
        </>
    );
}
