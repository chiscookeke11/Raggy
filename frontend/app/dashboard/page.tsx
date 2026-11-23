"use client"

import Chatbox from "@/components/dashboard_components/ChatBox";
import Chunks from "@/components/dashboard_components/Chunks";
import DocumentProcessingSteps from "@/components/dashboard_components/DocumentProcessingSteps";
import Metrics from "@/components/dashboard_components/Metrics";
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
            {uploadedDocument ? <>
                <div className="space-y-1" >
                    <h1 className="text-[#11181c] text-4xl font-semibold  "> {uploadedDocument.filename} </h1>
                    <p className="font-normal text-base  text-[#687076]  " >{formatFileSize(uploadedDocument.size_bytes ?? 0)},
                        {" "}
                        {uploadedDocument?.status}
                    </p>
                </div>
            </>
                :
                <div className="w-full flex items-center justify-center h-[50vh] " >
                    <h2 className="text-3xl font-semibold  " >   Please select or  upload a document </h2>
                </div>
            }


            {/* Document upload and processing steps  */}
            {uploadedDocument && (
                <DocumentProcessingSteps documentId={uploadedDocument.id} />
            )}

            {/* chat and result section */}
            {uploadedDocument && (

                <>
                    <section className="w-full  flex items-start gap-28 mt-14" >

                        <Chatbox />
                        <Metrics />

                    </section>


                    <Chunks />
                </>



            )}



        </div>
    )
}