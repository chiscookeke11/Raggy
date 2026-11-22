"use client"

import { useDocumentStore } from "@/store/document.store";
import DocumentUploader from "./DocumentUploader";
import { useEffect, useState } from "react";
import { getDocuments, getDocumentById } from "@/services/document.service";
import DocumentListSkeleton from "./DocumentSkeleton";


export default function DashboardNavigationBar() {
    const setDocuments = useDocumentStore(
        (state) => state.setDocuments
    )

    const documents = useDocumentStore((s) =>
        s.documents)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const setActiveDocument = useDocumentStore(
        (state) => state.setActiveDocument
    );

    const updateDocument = useDocumentStore(
        (state) => state.updateDocument
    );





    const handleDocumentClick = async (docId: string) => {
        try {
            setActiveDocument(docId);

            const document = await getDocumentById(docId);

            updateDocument(document);

        } catch (err) {
            console.error("Failed to fetch document:", err);
        }
    };





    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const documents = await getDocuments();

                setDocuments(documents);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch documents"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [setDocuments]);




    return (
        <div className="  w-full h-full overflow-y-auto py-10 px-[6%] flex flex-col items-start gap-20 mb-10 thin-scrollbar " >

            <DocumentUploader />

            <div className="w-full flex flex-col items-start gap-6" >
                <h4 className="text-2xl font-semibold  " >Documents</h4>

                {loading ?
                    <DocumentListSkeleton />
                    :

                    !documents ? (
                        "No found "
                    )

                        :



                        documents.map((d) => (
                            <div
                                onClick={() => handleDocumentClick(d.id)}
                                key={d.id}
                                className="w-full flex flex-col items-start gap-1 text-wrap " >
                                <div className="w-full py-4 px-2 bg-white  border-t border-black/12  cursor-pointer "  >
                                    <h5 className=" text-lg font-medium truncate "> {d.filename} </h5>
                                    <p className="font-normal text-sm  text-[#687076]  " >{d.page_count} page{d.page_count > 1 && "s"},
                                        {" "}
                                        {d.chunk_count} chunk{d.chunk_count > 1 && "s"}</p>
                                </div>


                            </div>
                        ))}


            </div>

        </div >
    )
}