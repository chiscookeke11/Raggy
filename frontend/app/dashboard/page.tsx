"use client"

import DocumentProcessingSteps from "@/components/dashboard_components/DocumentProcessingSteps";
import Button from "@/components/ui/CustomButton";
import { formatFileSize } from "@/lib/utils";
import { useDocumentStore } from "@/store/document.store";



export default function Page() {

    const uploadedDocument = useDocumentStore((state) =>
        state.documents.find(
            (document) => document.id === state.activeDocumentId
        ) ?? null
    );







    return (
        <div className="w-full flex flex-col items-start gap-5 " >

            {/* document metadata */}
            <div className="space-y-1" >
                <h1 className="text-[#11181c] text-4xl font-semibold  "> {uploadedDocument?.filename} </h1>
                <p className="font-normal text-base  text-[#687076]  " >{formatFileSize(uploadedDocument?.size_bytes ?? 0)},
                    {" "}
                    {uploadedDocument?.status}
                </p>
            </div>


            {/* Document upload and processing steps  */}
            {uploadedDocument && (
                <DocumentProcessingSteps documentId={uploadedDocument.id} />
            )}

            {/* chat and result section */}
            <section className="w-full  flex items-start gap-28 mt-14" >

                <div className="w-full flex basis-2/6   flex-col items-start gap-7  " >
                    <h1 className="text-2xl font-semibold  ">Ask</h1>

                    <div className="flex items-start flex-col gap-0.5 " >
                        <h4 className=" text-sm text-[#687076] " >You asked:</h4>
                        <p className="text-base font-medium text-[#11181c]  " >Why did the hare lose the race?</p>
                    </div>


                    <div className="flex items-start flex-col gap-0.5 ">
                        <h6 className=" text-sm text-[#687076] ">Answer</h6>
                        <p className="text-base font-normal text-[#11181c]  ">The hare stopped halfway, lay down in the shade and fell asleep.
                            The tortoise kept walking, passed him, and touched the old oak first.</p>
                    </div>





                    <div className="w-full flex items-center gap-4" >
                        <div className="w-fit  flex flex-col items-start gap-0.5 " >
                            <h6 className=" text-xs text-[#687076] ">Embed Question</h6>
                            <p className="text-sm font-medium text-[#11181c]  ">0.2s</p>
                        </div>


                        <div className="w-fit  flex flex-col items-start gap-0.5 " >
                            <h6 className=" text-xs text-[#687076] ">Search</h6>
                            <p className="text-sm font-medium text-[#11181c]  ">5ms</p>
                        </div>

                        <div className="w-fit  flex flex-col items-start gap-0.5 " >
                            <h6 className=" text-xs text-[#687076] ">Generate</h6>
                            <p className="text-sm font-medium text-[#11181c]  ">4.1s</p>
                        </div>


                        <div className="w-fit  flex flex-col items-start gap-0.5 " >
                            <h6 className=" text-xs text-[#687076] ">Prompt</h6>
                            <p className="text-sm font-medium text-[#11181c]  ">640 tokens</p>
                        </div>


                    </div>


                    <div className="w-full flex items-center justify-between gap-3 "  >

                        <input
                            type="text"
                            className="flex-1 border py-2 px-4 outline-0 text-[#11181c] "
                            placeholder="Ask about this document"
                        />

                        <Button>
                            Ask
                        </Button>
                    </div>
                </div>




                <div className="w-full basis-4/6  flex flex-col items-start gap-3 relative py-10 " >


                    <div className="w-0.5 h-[105%] bg-[#11181c]  absolute top-[50%] left-0
                 translate-y-[-50%]
                 " />


                    <div className="w-0.5 h-[105%] bg-[#11181c]  absolute top-[50%] right-0
                 translate-y-[-50%]
                 " />



                    <div className="h-0.5 w-full bg-[#11181c]  absolute top-0 left-[50%]
                 translate-x-[-50%]
                 " />

                    <div className="h-0.5 w-full bg-[#11181c]  absolute bottom-0 left-[50%]
                 translate-x-[-50%]
                 " />








                    <div className="w-full  flex items-center justify-start gap-5 pb-4 px-4 border-b border-black/50  " >
                        <Button className="text-sm py-1.5! px-3! " >Retrieval</Button>
                        <Button className="text-sm py-1.5! px-3! ">Prompt</Button>
                        <Button className="text-sm py-1.5! px-3! ">Timing</Button>
                    </div>

                    <div className="w-full flex items-center justify-between px-4  " >
                        <h5 className=" text-[#687076]  font-normal text-xs md:text-sm ">Top 5 of 8 chunks, by cosine similarity</h5>

                        <div className="w-fit flex items-center gap-1.5" >
                            <Button className="text-sm py-1.5! px-3! " >Sort</Button>
                            <Button className="text-sm py-1.5! px-3! ">Rank</Button>
                            <Button className="text-sm py-1.5! px-3! ">Document Order</Button>
                        </div>

                    </div>


                    {/* view */}
                    <div className="w-full flex items-center justify-between gap-10 px-4 py-4 border-b border-t border-black/50 " >


                        <div className="w-fit flex items-center gap-5 py-4 " >
                            <h5 className=" text-xl text-[#687076] ">1</h5>
                            <div className="w-20 flex flex-col items-center justify-center gap-3 " >
                                <h4 className="text-lg font-medium text-[#11181c]  ">0.79</h4>
                                <progress value="0.7" max="1" />
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-start gap-3 " >
                            <p className=" text-lg text-[#687076] font-mono ">the cjhunkjdjhsdjhdsjdhjsh</p>
                            <small className=" text-[#687076]  font-normal text-xs md:text-sm ">chunk 6, page 1, cited 1</small>
                        </div>

                    </div>


                </div>

            </section>



        </div>
    )
}