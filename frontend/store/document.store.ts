
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DocumentUploadResponse } from "@/types/types";

interface DocumentState {
    documents: DocumentUploadResponse[];
    activeDocumentId: string | null;

    addDocument: (document: DocumentUploadResponse) => void;
    updateDocument: (document: DocumentUploadResponse) => void;
    removeDocument: (documentId: string) => void;
    setActiveDocument: (documentId: string | null) => void;
    setDocuments: (documents: DocumentUploadResponse[]) => void;
}

export const useDocumentStore = create<DocumentState>()(
    persist(
        (set) => ({
            documents: [],
            activeDocumentId: null,

            addDocument: (document) =>
                set((state) => ({
                    documents: [
                        document,
                        ...state.documents.filter(
                            (item) => item.id !== document.id
                        ),
                    ],
                })),

            updateDocument: (document) =>
                set((state) => ({
                    documents: state.documents.map((item) =>
                        item.id === document.id ? document : item
                    ),
                })),

            removeDocument: (documentId) =>
                set((state) => ({
                    documents: state.documents.filter(
                        (item) => item.id !== documentId
                    ),
                    activeDocumentId:
                        state.activeDocumentId === documentId
                            ? null
                            : state.activeDocumentId,
                })),

            setActiveDocument: (documentId) =>
                set({ activeDocumentId: documentId }),

            setDocuments: (documents) =>
                set({ documents }),
        }),
        {
            name: "raggy-documents",
            partialize: (state) => ({
                documents: state.documents,
                activeDocumentId: state.activeDocumentId,
            }),
        }
    )
);
