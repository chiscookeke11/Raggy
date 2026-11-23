
"use client";

import { sendChatMessage } from "@/services/document.service";
import { useDocumentStore } from "@/store/document.store";
import { ChatResponse } from "@/types/types";
import { FormEvent, useEffect, useState } from "react";
import Button from "../ui/CustomButton";
import { useChatStore } from "@/store/chat.store";

function formatDuration(ms: number) {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

export default function Chatbox() {
    const [question, setQuestion] = useState("");
    const response = useChatStore((state) => state.latestResponse);
    const setLatestResponse = useChatStore(
        (state) => state.setLatestResponse
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadedDocument = useDocumentStore((state) =>
        state.documents.find(
            (document) => document.id === state.activeDocumentId
        ) ?? null
    );

    // Clear the previous conversation result when another document is selected
    useEffect(() => {
        setLatestResponse(null);
        setError(null);
    }, [uploadedDocument?.id, setLatestResponse]);

    const handleAskQuestion = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!question.trim() || !uploadedDocument || loading) return;

        setLoading(true);
        setError(null);

        try {
            const result = await sendChatMessage({
                question: question.trim(),
                top_k: 5,
                document_ids: [uploadedDocument.id],
            });

            setLatestResponse(result);
            setQuestion("");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to get an answer"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex basis-2/6 flex-col items-start gap-7">

            <h1 className="text-2xl font-semibold">Ask</h1>

            {!uploadedDocument ? (
                <p className="text-sm text-[#687076]">
                    Select a document to start asking questions.
                </p>
            ) : uploadedDocument.status !== "ready" ? (
                <p className="text-sm text-[#687076]">
                    Your document is still being processed.
                </p>
            ) : (
                <>
                    {response ? (
                        <>
                            <div className="flex items-start flex-col gap-0.5">
                                <h4 className="text-sm text-[#687076]">
                                    You asked:
                                </h4>

                                <p className="text-base font-medium text-[#11181c]">
                                    {response.question}
                                </p>
                            </div>

                            <div className="flex items-start flex-col gap-2">
                                <h6 className="text-sm text-[#687076]">
                                    Answer
                                </h6>

                                <p className="text-base font-normal text-[#11181c] whitespace-pre-wrap">
                                    {response.answer}
                                </p>
                            </div>

                            {/* Processing metrics */}
                            <div className="w-full flex flex-wrap items-center gap-5">

                                <div className="flex flex-col items-start gap-0.5">
                                    <h6 className="text-xs text-[#687076]">
                                        Embed Question
                                    </h6>
                                    <p className="text-sm font-medium text-[#11181c]">
                                        {formatDuration(response.trace.timings.embedding_ms)}
                                    </p>
                                </div>

                                <div className="flex flex-col items-start gap-0.5">
                                    <h6 className="text-xs text-[#687076]">
                                        Search
                                    </h6>
                                    <p className="text-sm font-medium text-[#11181c]">
                                        {formatDuration(response.trace.timings.retrieval_ms)}
                                    </p>
                                </div>

                                <div className="flex flex-col items-start gap-0.5">
                                    <h6 className="text-xs text-[#687076]">
                                        Generate
                                    </h6>
                                    <p className="text-sm font-medium text-[#11181c]">
                                        {formatDuration(response.trace.timings.generation_ms)}
                                    </p>
                                </div>

                                <div className="flex flex-col items-start gap-0.5">
                                    <h6 className="text-xs text-[#687076]">
                                        Prompt
                                    </h6>
                                    <p className="text-sm font-medium text-[#11181c]">
                                        {response.trace.usage.prompt_tokens} tokens
                                    </p>
                                </div>

                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-[#687076]">
                            Ask a question about {uploadedDocument.filename}.
                        </p>
                    )}

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    {/* Question input */}
                    <form
                        onSubmit={handleAskQuestion}
                        className="w-full flex items-center justify-between gap-3"
                    >
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="flex-1 min-w-0 border py-2 px-4 outline-0 text-[#11181c] "
                            placeholder="Ask about this document"
                            disabled={loading}
                        />

                        <Button
                            type="submit"
                            disabled={loading || !question.trim()}
                            className="bg-[#11181c] text-white px-5 py-2  text-sm disabled:opacity-50"
                        >
                            {loading ? "Asking..." : "Ask"}
                        </Button>
                    </form>
                </>
            )}

        </div>
    );
}
