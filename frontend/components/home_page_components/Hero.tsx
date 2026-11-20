import Image from "next/image";
import Button from "../ui/CustomButton";




export default function Hero() {
    return (
        <section className=" py-16 px-[3%] flex flex-col items-center justify-center gap-10 font-grotesque overflow-x-hidden " >


            <div className="w-full md:max-w-180 text-center lg:max-w-207 flex flex-col items-center justify-center gap-7 " >
                <h1 className="text-[#11181c] text-3xl md:text-5xl font-semibold ">
                    Don’t just trust the answer. Inspect how it was generated.</h1>

                <p className="text-[#687076] font-medium text-base md:text-xl  " >Raggy answers questions from your documents on your own machine,
                    and shows every step: the chunks it found,
                    how closely each one matched,
                    and the exact prompt the model read.</p>

                <div className="w-fit p-2 border border-[#11181c] flex items-center gap-4 justify-center " >
                    <Button className="text-sm md:text-base " >
                        Dashboard
                    </Button>

                    <Button className="text-sm md:text-base ">
                        See how it works
                    </Button>
                </div>

                <p className=" text-[#687076]  font-normal text-xs md:text-sm " >
                    No account, no API key. Your documents never leave this computer.</p>

            </div>



            <div className="bg-white w-full max-w-6xl  relative my-19 py-10 space-y-4 " >


                <div className="w-0.5 h-[130%] bg-[#11181c]  absolute top-[50%] left-0
                 translate-y-[-50%]
                 " />


                <div className="w-0.5 h-[130%] bg-[#11181c]  absolute top-[50%] right-0
                 translate-y-[-50%]
                 " />



                <div className="h-0.5 w-[130%] bg-[#11181c]  absolute top-0 left-[50%]
                 translate-x-[-50%]
                 " />

                <div className="h-0.5 w-[130%] bg-[#11181c]  absolute bottom-0 left-[50%]
                 translate-x-[-50%]
                 " />


                <div className="w-full flex items-center gap-5 py-5 px-7  " >


                    <div className=" md:space-y-1" >
                        <h3 className="text-base md:text-xl font-medium " >Question</h3>
                        <h2 className=" text-xl md:text-3xl font-semibold " >How much notice does either side need to give?</h2>
                    </div>

                    <Image
                        src={"/logos/giphy.gif"}
                        alt="image"
                        width={500}
                        height={500}
                        className=" w-6 md:w-10 "
                    />
                </div>



                <div className="w-full border px-5 py-3.5 flex items-start  gap-6 " >
                    <h4 className="font-semibold text-lg md:text-2xl text-[#11181c] "  >0.82</h4>

                    <div className=" flex flex-col items-start gap-0.5 " >
                        <p className="text-[#11181c] text-sm md:text-base " >Either party may end this agreement by giving
                            {" "}
                            <span className="bg-yellow-300 px-1 py-0.5 ">
                                30 days written notice
                            </span>{" "}
                        </p>
                        <small className="text-[10px] md:text-xs text-[#687076]">contract.pdf, page 4</small>
                    </div>

                </div>



                <div className="w-full border-b px-5 py-3 flex items-start  gap-6 " >
                    <h4 className="font-semibold text-lg md:text-2xl text-[#11181c] ">0.74</h4>

                    <div className=" flex flex-col items-start gap-0.5 " >
                        <p className="text-[#11181c] text-sm md:text-base " >Notice must be delivered to the address listed in Schedule A.</p>
                        <small className="text-[10px] md:text-xs text-[#687076]">contract.pdf, page 4</small>
                    </div>

                </div>



                <div className="w-full border-b px-5 py-3 flex items-start  gap-6 " >
                    <h4 className="font-semibold text-lg md:text-2xl text-[#11181c] ">0.58</h4>

                    <div className=" flex flex-col items-start gap-0.5 " >
                        <p className="text-[#11181c] text-sm md:text-base " >Payment is due within 14 days of each invoice.</p>
                        <small className="text-[10px] md:text-xs text-[#687076]" >contract.pdf, page 4</small>
                    </div>

                </div>

                <p className="px-5 text-xs md:text-sm text-[#11181c]  " >Sample values. Your own documents produce the real thing.</p>


            </div>

        </section>
    )
}