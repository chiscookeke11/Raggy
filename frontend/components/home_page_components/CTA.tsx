import Button from "../ui/CustomButton";



export default function CTA() {
    return (
        <section className=" w-full flex flex-col items-center justify-center py-40 px-3 font-grotesque  border-b border-[#11181c] ">



            <div className="w-full max-w-4xl flex items-center justify-center gap-5 flex-col text-center "  >
                <h3 className="text-[#11181c] text-2xl md:text-4xl font-semibold ">Get the full picture of your documents in seconds</h3>
                <p className="text-[#687076] text-base md:text-lg  ">Upload a PDF, text, or Markdown file and watch as AI extracts, processes,
                    and makes sense of your content. Then ask questions and get instant, insightful answers.</p>

                <Button className="mt-7 " >Get started</Button>
            </div>
        </section>
    )
}