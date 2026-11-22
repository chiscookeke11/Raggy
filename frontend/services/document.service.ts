import { apiRequest } from "@/lib/api";
import { DocumentUploadResponse } from "@/types/types";
import { resolve } from "path";




export const uploadDocument = async (
    file: File
): Promise<DocumentUploadResponse> => {

    const formData = new FormData();

    formData.append("file", file)

    return apiRequest<DocumentUploadResponse>(
        "/documents/upload",
        {
            method: "POST",
            body: formData
        }
    )


}



// this function fetches a document by its ID
export async function getDocumentById(
    docId: string,
    signal?: AbortSignal
): Promise<DocumentUploadResponse> {
    return apiRequest<DocumentUploadResponse>(
        `/documents/${encodeURIComponent(docId)}`,
        { signal }
    );
}



// this function polls the backend to get the document upload status
export async function pollDocumentStatus(
    docId: string,
    onUpdate: (document: DocumentUploadResponse) => void,
    signal?: AbortSignal,
    interval: number = 2000
): Promise<DocumentUploadResponse> {

    while (!signal?.aborted) {
        const document = await getDocumentById(docId, signal);

        onUpdate(document);

        if (
            document.status === "ready" ||
            document.status === "failed"
        ) {
            return document;
        }

        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(resolve, interval);

            signal?.addEventListener(
                "abort",
                () => {
                    clearTimeout(timeout);
                    reject(new DOMException("Polling cancelled", "AbortError"));
                },
                { once: true }
            );
        });
    }

    throw new DOMException("Polling cancelled", "AbortError");
}




// Fetch all uploaded documents
export async function getDocuments(): Promise<DocumentUploadResponse[]> {
    return apiRequest<DocumentUploadResponse[]>("/documents");
}