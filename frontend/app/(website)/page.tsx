import CTA from "@/components/home_page_components/CTA";
import DocumentFlow from "@/components/home_page_components/DocumentFlow";
import Features from "@/components/home_page_components/Features";
import Footer from "@/components/home_page_components/Footer";
import Hero from "@/components/home_page_components/Hero";
import Parts from "@/components/home_page_components/Parts";


export default function Page() {
    return (
        <>
            <Hero />
            <Parts />
            <Features />
            <DocumentFlow />
            <CTA />
            <Footer />
        </>
    )
}