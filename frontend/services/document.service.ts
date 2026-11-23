import { apiRequest } from "@/lib/api";
import { ChatRequest, ChatResponse, ChatTrace, DocumentChunk, DocumentUploadResponse, PromptMessage } from "@/types/types";
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



// deleteing a document
export async function deleteDocument(docId: string) {
    return apiRequest<void>(`/documents/${encodeURIComponent(docId)}`, {
        method: "DELETE"
    })
}



// get chunks of a document
export interface GetChunksParams {
    search?: string;
    page?: number;
    limit?: number;
    offset?: number;
}

export async function getDocumentChunks(
    documentId: string,
    params: GetChunksParams = {}
): Promise<DocumentChunk[]> {
    const queryParams = new URLSearchParams();

    if (params.search) {
        queryParams.set("search", params.search);
    }

    if (params.page !== undefined) {
        queryParams.set("page", String(params.page));
    }

    if (params.limit !== undefined) {
        queryParams.set("limit", String(params.limit));
    }

    if (params.offset !== undefined) {
        queryParams.set("offset", String(params.offset));
    }

    const query = queryParams.toString();

    return apiRequest<DocumentChunk[]>(
        `/chunks/${encodeURIComponent(documentId)}${query ? `?${query}` : ""}`
    );
}




// chat service
export async function sendChatMessage(
    payload: ChatRequest
): Promise<ChatResponse> {
    return apiRequest<ChatResponse>("/chat", {
        method: "POST",
        body: JSON.stringify(payload)
    })
}


// Fetch retrieval information for a particular chat
export async function getChatRetrieval(
    chatId: string
): Promise<ChatTrace> {
    return apiRequest<ChatTrace>(
        `/retrieval/${encodeURIComponent(chatId)}`
    );
}


// Fetch the prompt messages sent to the LLM
export async function getChatPrompt(
    chatId: string
): Promise<PromptMessage[]> {
    return apiRequest<PromptMessage[]>(
        `/prompt/${encodeURIComponent(chatId)}`
    );
}