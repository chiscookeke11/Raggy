import Navbar from "@/components/home_page_components/Navbar";

export default function WebsiteLayout({ children }: LayoutProps<"/">) {
    return (
        <div className="relative isolate min-h-screen">
            {/* Background */}
            <div
                className="
                    absolute inset-0 -z-10
                    bg-[url('/bg/grid_bg.svg')]
                    bg-fixed bg-center bg-cover
                    opacity-5
                    pointer-events-none
                "
            />

            <Navbar />
            {children}
        </div>
    );
}