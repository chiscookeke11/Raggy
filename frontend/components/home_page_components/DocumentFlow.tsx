


export default function DocumentFlow() {
    return (
        <section className=" w-full flex flex-col items-center py-26 px-3 font-grotesque border-t border-b border-[#11181c] overflow-x-hidden md:overflow-x-visible " >


            <div className="bg-white w-full max-w-337.5 relative py-10 px-2 md:px-5 flex flex-col md:flex-row items-center justify-between gap-10  " >


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



                <div className=" w-full basis-2/5 space-y-2 " >

                    <h4 className="font-semibold text-xl md:text-3xl text-[#11181c]   ">Your documents stay on your machine</h4>
                    <p className="text-sm md:text-lg font-medium text-[#687076]" >Nothing is collected because nothing is sent anywhere.
                        That is a design rule, not a setting.</p>

                </div>



                <div className=" w-full basis-3/5  flex flex-col items-start border-l-0 md:border-l-2 border-[#11181c] gap-6 md:pl-5 ">


                    <div className="w-full flex items-center justify-between py-2 px-3 gap-7 " >

                        <div className=" size-9 md:size-18 rounded-full flex items-center justify-center shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] bg-[linear-gradient(232.88deg,#9747FF5C_-20.71%,#9747FF00_47.36%)] " >

                        </div>

                        <div className=" space-y-1 flex-1 " >
                            <h6 className=" font-semibold text-base md:text-xl text-[#11181c]  "  >Local models</h6>
                            <p className="text-sm md:text-base font-medium text-[#687076]">Embeddings and answers come from models running in Ollama on your computer.</p>
                        </div>
                    </div>


                    <div className="w-full flex items-center justify-between py-2 px-3  gap-7" >

                        <div className="size-9 md:size-18 rounded-full flex items-center justify-center  shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] bg-[linear-gradient(232.88deg,#9747FF5C_-20.71%,#9747FF00_47.36%)]" >

                        </div>

                        <div className=" space-y-1 flex-1" >
                            <h6 className=" font-semibold text-base md:text-xl text-[#11181c]  "  >No data collection</h6>
                            <p className="text-sm md:text-base font-medium text-[#687076]">No accounts, no analytics scripts, no calls to outside services.</p>
                        </div>
                    </div>



                    <div className="w-full flex items-center justify-between py-2 px-3  gap-7" >

                        <div className="size-9 md:size-18 rounded-full flex items-center justify-center shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] bg-[linear-gradient(232.88deg,#9747FF5C_-20.71%,#9747FF00_47.36%)] " >

                        </div>

                        <div className=" space-y-1 flex-1" >
                            <h6 className=" font-semibold text-base md:text-xl text-[#11181c]  "  >Delete means delete</h6>
                            <p className="text-sm md:text-base font-medium text-[#687076]">Removing a document deletes its file, its chunks and its vectors.</p>
                        </div>
                    </div>


                </div>






            </div>


        </section>
    )
}