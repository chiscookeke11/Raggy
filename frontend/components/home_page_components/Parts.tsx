import { document_processing_steps, question_flow } from "@/data/steps";
import { Play } from "lucide-react";




export default function Parts() {
    return (
        <section
        id="how_it_works"
        className=" w-full h-full py-10 md:py-20  flex flex-col gap-10 md:gap-0  font-grotesque border border-[#11181c] " >


            <div className="w-full px-3.5 lg:ml-[19%] max-w-120 flex flex-col items-start gap-2 " >
                <h2 className="text-[#11181c] text-2xl md:text-4xl font-semibold ">Built from parts you can run yourself</h2>
                <p className="text-[#11181c] text-sm md:text-base " >No hosted service sits behind it. Four local pieces
                    do all of the work, and you can open any of them.</p>
            </div>



            <div className=" w-full hidden md:flex items-center justify-between overflow-x-hidden  h-125  " >


                <div className="hidden lg:block shrink-0 size-90 -ml-50 rounded-full
                border border-[#9747FF5C] bg-[linear-gradient(232.88deg,#9747FF5C_-20.71%,#9747FF00_47.36%)]
                " >
                </div>




                <div className="w-full border border-[#9747FF] relative "  >

                    <span
                        className=" size-3.5 block rounded-full absolute border-2 border-[#9747FF] top-[50%] translate-y-[-50%] -left-2
bg-white"
                    />
                    <Play
                        size={17}
                        stroke="#9747FF"
                        fill="#9747FF"
                        className="absolute top-[50%] translate-y-[-50%] -right-1" />
                </div>



                <div className="shrink-0 w-57.5 h-43.25 border border-[#9747FF] bg-white py-3 px-4 flex flex-col items-start justify-center gap-0.5 "  >
                    <h5 className=" text-lg md:text-xl font-medium mb-1 "  >Ollama</h5>
                    <p className=" font-normal text-sm md:text-base text-[#687076] " >nomic-embed-text</p>
                    <p className=" font-normal text-sm md:text-base text-[#687076] ">qwen3</p>
                </div>

                <div className="w-full border border-[#9747FF] relative "  >

                    <span
                        className=" size-3.5 block rounded-full absolute border-2 border-[#9747FF] top-[50%] translate-y-[-50%] -left-2
bg-white"
                    />
                    <Play
                        size={17}
                        stroke="#9747FF"
                        fill="#9747FF"
                        className="absolute top-[50%] translate-y-[-50%] -right-1" />
                </div>

                <div className="shrink-0 w-57.5 h-43.25 border border-[#9747FF]
                bg-white py-3 px-4 flex flex-col items-start justify-center gap-0.5
                " >
                    <h5 className=" text-lg md:text-xl font-medium mb-1" >ChromaDB</h5>
                    <p className=" font-normal text-sm md:text-base text-[#687076] ">chunks collection</p>
                    <p className=" font-normal text-sm md:text-base text-[#687076] ">cosine</p>
                    <p className=" font-normal text-sm md:text-base text-[#687076] ">index</p>
                </div>

                <div className="w-full border border-[#9747FF] relative "  >

                    <span
                        className=" size-3.5 block rounded-full absolute border-2 border-[#9747FF] top-[50%] translate-y-[-50%] -left-2
bg-white"
                    />
                    <Play
                        size={17}
                        stroke="#9747FF"
                        fill="#9747FF"
                        className="absolute top-[50%] translate-y-[-50%] -right-1" />
                </div>

                <div className="shrink-0 w-57.5 h-43.25 border border-[#9747FF]
                bg-white py-3 px-4 flex flex-col items-start justify-center gap-0.5
                " >
                    <h5 className=" text-lg md:text-xl font-medium mb-1" >SQLite</h5>
                    <p className=" font-normal text-sm md:text-base text-[#687076] ">Documents</p>
                    <p className=" font-normal text-sm md:text-base text-[#687076] ">Chunks</p>
                    <p className=" font-normal text-sm md:text-base text-[#687076] ">Chats</p>
                </div>

                <div className="w-full border border-[#9747FF] relative "  >

                    <span
                        className=" size-3.5 block rounded-full absolute border-2 border-[#9747FF] top-[50%] translate-y-[-50%] -left-2
bg-white"
                    />
                    <Play
                        size={17}
                        stroke="#9747FF"
                        fill="#9747FF"
                        className="absolute top-[50%] translate-y-[-50%] -right-1" />
                </div>


                <div className="shrink-0 w-57.5 h-43.25 border border-[#9747FF]
                bg-white py-3 px-4 flex flex-col items-start justify-center gap-0.5
                " >
                    <h5 className=" text-lg md:text-xl font-medium mb-1" >FastAPI</h5>
                    <p className=" font-normal text-sm md:text-base text-[#687076] ">/documents</p>
                    <p className=" font-normal text-sm md:text-base text-[#687076] ">/chat</p>
                    <p className=" font-normal text-sm md:text-base text-[#687076] ">/retrieval</p>
                </div>


                <div className="w-full border border-[#9747FF] relative "  >

                    <span
                        className=" size-3.5 block rounded-full absolute border-2 border-[#9747FF] top-[50%] translate-y-[-50%] -left-2
bg-white"
                    />
                    <Play
                        size={17}
                        stroke="#9747FF"
                        fill="#9747FF"
                        className="absolute top-[50%] translate-y-[-50%] -right-1" />
                </div>

                <div className="hidden lg:block shrink-0 size-90 mr-[-200px] rounded-full
                border border-[#9747FF5C] bg-[linear-gradient(232.88deg,#9747FF5C_-20.71%,#9747FF00_47.36%)] rotate-[200deg] "
                >

                </div>


            </div>



            <div className="w-full  max-w-7xl  mx-auto flex md:flex-row flex-col px-3.5 items-start gap-10 md:gap-30 " >


                <div className="w-full basis-1/2  flex-col items-start flex "  >
                    <h5 className=" text-xl md:text-3xl font-semibold   " >First, the document</h5>
                    <p className="text-[#11181c] text-sm md:text-base " >Runs once for each file you upload.</p>

                    <div className=" w-full flex items-center gap-3 md:gap-5 flex-wrap mt-8 " >

                        {document_processing_steps.map((step, i) => (
                            <span
                                key={i}
                                className=" border border-[#11181c] rounded-[100px] px-4 py-1
                        flex items-center justify-center text-sm text-[#11181c]
                         " >
                                {step}</span>
                        ))}
                    </div>
                </div>


                <div className="w-full basis-1/2  flex-col items-start flex "  >
                    <h5 className=" text-xl md:text-3xl font-semibold   " >Then, the question</h5>
                    <p className="text-[#11181c] text-sm md:text-base " >Runs every time you ask.</p>

                    <div className=" w-full flex items-center  gap-3 md:gap-5 flex-wrap mt-8 " >

                        {question_flow.map((step, i) => (
                            <span
                                key={i}
                                className=" border border-[#11181c] rounded-[100px] px-4 py-1
                        flex items-center justify-center text-sm text-[#11181c]
                         " >
                                {step}</span>
                        ))}
                    </div>
                </div>


            </div>

        </section>
    )
}