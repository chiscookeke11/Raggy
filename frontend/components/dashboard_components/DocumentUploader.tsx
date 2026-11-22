
"use client";

import { pollDocumentStatus, uploadDocument } from "@/services/document.service";
import { DocumentUploadResponse } from "@/types/types";
import { Upload, FileText, X } from "lucide-react";
import { useRef, useState } from "react";
import Button from "../ui/CustomButton";
import { useDocumentStore } from "@/store/document.store";

export default function DocumentUploader() {
    const ACCEPT = ".pdf,.txt,.md";
    const MAX_FILE_SIZE = 25 * 1024 * 1024;

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const documents = useDocumentStore(
        (state) => state.documents
    );

    const uploadedDocument = documents[0] ?? null;


    const addDocument = useDocumentStore(
        (state) => state.addDocument
    );

    const updateDocument = useDocumentStore(
        (state) => state.updateDocument
    );

    const setActiveDocument = useDocumentStore(
        (state) => state.setActiveDocument
    );




    const handleFileChange = (selectedFile?: File) => {
        if (!selectedFile) return;

        setError(null);

        if (selectedFile.size > MAX_FILE_SIZE) {
            setError("File size must not exceed 25 MB.");
            return;
        }

        const extension = selectedFile.name
            .split(".")
            .pop()
            ?.toLowerCase();

        if (!["pdf", "txt", "md"].includes(extension ?? "")) {
            setError("Only PDF, TXT and Markdown files are supported.");
            return;
        }

        setFile(selectedFile);
    };






    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const response = await uploadDocument(file);

            addDocument(response);

            // Make the newly uploaded document the active document
            setActiveDocument(response.id);

            if (
                response.status === "processing" ||
                response.status === "pending"
            ) {
                setProcessing(true);


                await pollDocumentStatus(response.id, (updatedDocument) => {
                    updateDocument(updatedDocument);
                });
            }


            setFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to upload document"
            );
        } finally {
            setUploading(false);
            setProcessing(false);
        }
    };

    const removeFile = () => {
        setFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full flex flex-col gap-3 items-start">

            <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT}
                className="hidden"
                onChange={(e) =>
                    handleFileChange(e.target.files?.[0])
                }
            />

            {!file ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed
                    border-[#687076] py-8 px-6
                    flex flex-col items-center text-center
                    gap-2 cursor-pointer hover:bg-[#F1F5F9]
                    transition-colors"
                >
                    <Upload size={20} strokeWidth={1.5} />

                    <p className="text-[#0F172A] text-sm font-bold">
                        Upload a document
                    </p>

                    <p className="text-[#64748B] text-xs">
                        Drop a PDF, TXT, or Markdown file here,
                        or click to choose one. Up to 25 MB
                    </p>
                </div>
            ) : (
                <div className="w-full border rounded-lg p-4
                flex items-center justify-between gap-3">

                    <div className="flex items-center gap-3 min-w-0">
                        <FileText size={22} />

                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                                {file.name}
                            </p>

                            <p className="text-xs text-gray-500">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={removeFile}
                        disabled={uploading}
                        aria-label="Remove selected file"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <Button
                className="w-full"
                onClick={handleUpload}
                disabled={!file || uploading}
            >
                {uploading
                    ? "Uploading..."
                    : processing
                        ? "Processing document..."
                        : "Upload document"}
            </Button>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {uploadedDocument && (
                <div className="w-full border rounded-lg p-4">
                    <h3 className="font-semibold">
                        {uploadedDocument.filename}
                    </h3>

                    <p className={`text-sm`}>
                        Status:
                        <span className={`${uploadedDocument.status === "ready" ? "text-green-600" : ""} `}>
                            {" "}{uploadedDocument.status}
                        </span>
                    </p>

                    <p className="text-xs text-gray-500">
                        Document ID: {uploadedDocument.id}
                    </p>
                </div>
            )}
        </div>
    );
}
