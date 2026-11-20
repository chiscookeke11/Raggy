import { chunks_and_scores } from "@/data/steps";



export default function Features() {
    return (
        <section className="w-full max-w-6xl py-6 my-6  flex flex-col gap-7 mx-auto font-grotesque  "  >


            <div className="space-y-1 border-b border-[#11181c] px-3.5 py-8  " >
                <h6 className="font-semibold text-xl md:text-3xl  " >Follow an answer back to its source</h6>
                <p className="text-[#11181c] text-sm md:text-base " >
                    Most document chat tools show an answer and nothing else. Here each stage is open to inspection.</p>
            </div>




            {/* See every chunk */}
            <div className="w-full flex items-center  border-b border-[#11181c] px-3.5 py-8 gap-7 " >
                <div className="space-y-1 " >
                    <h6 className="font-semibold text-xl md:text-3xl  " >See every chunk</h6>
                    <p className="text-[#11181c] text-sm md:text-base max-w-xl " >
                        Your document is cut into pieces before anything is searched.
                        Browse each piece with its page,
                        length and estimated tokens, and search the text to spot cuts
                        in the wrong place or leftover page furniture.</p>
                </div>




                <div className="bg-white w-full max-w-xl  relative my-19 py-10 space-y-4 " >


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

                    <div className="w-full border-b px-5 py-3.5 flex items-start  gap-6 " >

                        <div className=" flex flex-col items-start gap-0.5 " >

                            <small className="text-[10px] md:text-xs text-[#687076]">Chunk 12, page 4, 764 characters</small>
                            <p className="text-[#11181c] text-sm md:text-base " >
                                Either party may end this agreement by
                                giving 30 days written notice to the other party.
                            </p>
                        </div>

                    </div>



                    <div className="w-full border-b px-5 py-3 flex items-start  gap-6 " >

                        <div className=" flex flex-col items-start gap-0.5 " >

                            <small className="text-[10px] md:text-xs text-[#687076]">Chunk 13, page 4, 702 characters</small>
                            <p className="text-[#11181c] text-sm md:text-base " >
                                Notice must be delivered to the address listed in Schedule A. Delivery by email is not valid notice.
                            </p>
                        </div>

                    </div>



                    <div className="w-full border-b px-5 py-3 flex items-start  gap-6 " >

                        <div className=" flex flex-col items-start gap-0.5 " >

                            <small className="text-[10px] md:text-xs text-[#687076]">Chunk 31, page 9, 18 characters</small>
                            <p className="text-[#11181c] text-sm md:text-base " >
                                Page 9 Confidential
                            </p>
                        </div>

                    </div>

                    <p className="px-5 text-xs md:text-sm text-[#11181c]  " >Sample values. Your own documents produce the real thing.</p>


                </div>







            </div>


            {/* Know why a passage was chosen */}


            <div className="w-full flex items-center  border-b border-[#11181c] px-3.5 py-8 gap-7 " >

                <div className="bg-white w-full max-w-xl  relative my-19 py-10 space-y-4 " >


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


                    {
                        chunks_and_scores.map((data, i) => (
                            <div key={i} className="w-full flex items-center justify-between px-3  "  >
                                <h6 className="font-medium md:text-base text-sm text-[#11181c]  " >{data.chunk}</h6>
                                <p className="text-xs md:text-sm text-[#687076]" >{data.score}</p>
                            </div>
                        ))
                    }



                    <p className="px-5 text-xs md:text-sm text-[#11181c] border-t border-[#11181c] pt-4  " >Sample values. Your own documents produce the real thing.</p>


                </div>



                <div className="flex flex-col items-end gap-1 " >
                    <h6 className="font-semibold text-xl md:text-3xl  " >Know why a passage was chosen</h6>
                    <p className="text-[#11181c] text-end text-sm md:text-base max-w-xl " >
                        Every question retrieves a ranked list of chunks with similarity scores.
                        A weak top score is an early warning that the answer may be thin.</p>
                </div>
            </div>




            {/* Read the exact prompt */}
            <div className="w-full flex items-center px-3.5 py-8 gap-7 " >

                <div className="flex flex-col items-start gap-1 " >
                    <h6 className="font-semibold text-xl md:text-3xl  " >Read the exact prompt</h6>
                    <p className="text-[#11181c] text-start text-sm md:text-base max-w-xl " >
                        The system prompt, the retrieved context and your question,
                        as one piece of text, exactly as the model received it.
                        Highlighted lines are what retrieval supplied.</p>
                </div>

                <div className="bg-white w-full max-w-xl  relative my-19 py-10 space-y-4 " >


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


                    <div className="w-full px-3 flex flex-col gap-1 " >
                        <p className=" text-xs md:text-sm text-[#687076] " >You answer questions using ONLY the context provided by the user.</p>
                        <p className=" text-xs md:text-sm text-[#687076] " >If the context does not contain the answer, say you could not find it.</p>



                        <div className="my-6 flex flex-col items-start gap-1 font-mono " >
                            <h6 className="font-medium text-sm md:text-base " >Context:</h6>
                            <p className=" text-sm md:text-base  text-[#11181c] " >[1] (contract.pdf, page 4)</p>
                            <p className=" text-sm md:text-base  text-[#11181c] " >Either party may end this agreement by giving 30 days written notice to the other party.</p>
                        </div>


                        <p className=" text-xs md:text-sm text-[#687076] " ><b>Question:</b> How much notice does either side need to give?</p>
                    </div>



                    <p className="px-5 text-xs md:text-sm text-[#11181c] border-t border-[#11181c] pt-4  " >Sample values. Your own documents produce the real thing.</p>


                </div>
            </div>


        </section>
    )
}