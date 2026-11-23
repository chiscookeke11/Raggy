
"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chat.store";
import {
    getChatRetrieval,
    getChatPrompt,
} from "@/services/document.service";
import type {
    ChatTrace,
    PromptMessage,
} from "@/types/types";

type MetricsTab = "retrieval" | "prompt" | "timing";

function formatDuration(ms: number) {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

export default function Metrics() {
    const [activeTab, setActiveTab] = useState<MetricsTab>("retrieval");

    const response = useChatStore((state) => state.latestResponse);

    // Retrieval state
    const [retrieval, setRetrieval] = useState<ChatTrace | null>(null);
    const [retrievalLoading, setRetrievalLoading] = useState(false);
    const [retrievalError, setRetrievalError] = useState<string | null>(null);

    // Prompt state
    const [prompt, setPrompt] = useState<PromptMessage[]>([]);
    const [promptLoading, setPromptLoading] = useState(false);
    const [promptError, setPromptError] = useState<string | null>(null);

    const tabs: { label: string; value: MetricsTab }[] = [
        { label: "Retrieval", value: "retrieval" },
        { label: "Prompt", value: "prompt" },
        { label: "Timing", value: "timing" },
    ];

    // Fetch retrieval and prompt information whenever a new chat arrives
    useEffect(() => {
        if (!response?.chat_id) {
            setRetrieval(null);
            setPrompt([]);
            return;
        }

        let cancelled = false;

        const chatId = response.chat_id;

        // Reset previous data
        setRetrieval(null);
        setPrompt([]);

        setRetrievalLoading(true);
        setPromptLoading(true);

        setRetrievalError(null);
        setPromptError(null);

        // Fetch retrieval information
        const fetchRetrieval = async () => {
            try {
                const data = await getChatRetrieval(chatId);

                if (!cancelled) {
                    setRetrieval(data);
                }
            } catch (error) {
                if (!cancelled) {
                    setRetrievalError(
                        error instanceof Error
                            ? error.message
                            : "Failed to fetch retrieval information."
                    );
                }
            } finally {
                if (!cancelled) {
                    setRetrievalLoading(false);
                }
            }
        };

        // Fetch prompt messages
        const fetchPrompt = async () => {
            try {
                const data = await getChatPrompt(chatId);

                if (!cancelled) {
                    setPrompt(data);
                }
            } catch (error) {
                if (!cancelled) {
                    setPromptError(
                        error instanceof Error
                            ? error.message
                            : "Failed to fetch prompt messages."
                    );
                }
            } finally {
                if (!cancelled) {
                    setPromptLoading(false);
                }
            }
        };

        // Both requests run independently
        void fetchRetrieval();
        void fetchPrompt();

        return () => {
            cancelled = true;
        };
    }, [response?.chat_id]);

    const chunks = retrieval?.chunks ?? [];

    return (
        <div className="w-full basis-4/6 flex flex-col items-start gap-3 relative py-10">

            {/* Borders */}
            <div className="w-0.5 h-[105%] bg-[#11181c] absolute top-[50%] left-0 translate-y-[-50%]" />

            <div className="w-0.5 h-[105%] bg-[#11181c] absolute top-[50%] right-0 translate-y-[-50%]" />

            <div className="h-0.5 w-full bg-[#11181c] absolute top-0 left-[50%] translate-x-[-50%]" />

            <div className="h-0.5 w-full bg-[#11181c] absolute bottom-0 left-[50%] translate-x-[-50%]" />

            {/* Tabs */}
            <div className="w-full flex items-center justify-start gap-5 pb-4 px-4 border-b border-black/50">

                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`text-sm py-1.5 px-3 transition-colors cursor-pointer ${activeTab === tab.value
                            ? "bg-[#11181c] text-white"
                            : "text-[#687076] hover:bg-gray-100"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}

            </div>

            {!response ? (
                <div className="w-full min-h-64 flex items-center justify-center px-4">
                    <p className="text-sm text-[#687076] text-center">
                        Ask a question to see retrieval metrics.
                    </p>
                </div>
            ) : (
                <>
                    {/* RETRIEVAL TAB */}
                    {activeTab === "retrieval" && (
                        <>
                            <div className="w-full flex items-center justify-between px-4 py-2">
                                <h5 className="text-[#687076] font-normal text-xs md:text-sm">
                                    {retrievalLoading
                                        ? "Fetching retrieved chunks..."
                                        : `${chunks.length} retrieved chunks, by cosine similarity`}
                                </h5>

                                <span className="text-xs text-[#687076]">
                                    Top K: {retrieval?.top_k ?? "-"}
                                </span>
                            </div>

                            {retrievalLoading ? (
                                <div className="w-full min-h-40 flex items-center justify-center">
                                    <p className="text-sm text-[#687076]">
                                        Loading retrieval information...
                                    </p>
                                </div>
                            ) : retrievalError ? (
                                <div className="w-full px-4 py-8">
                                    <p className="text-sm text-red-500">
                                        {retrievalError}
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full flex flex-col">
                                    {chunks.length > 0 ? (
                                        chunks.map((chunk) => (
                                            <div
                                                key={chunk.chunk_id}
                                                className="w-full flex items-start gap-5 px-4 py-5 border-b border-t border-black/20"
                                            >
                                                <h5 className="text-xl text-[#687076]">
                                                    {chunk.rank}
                                                </h5>

                                                <div className="w-20 shrink-0 flex flex-col items-center justify-center gap-3">
                                                    <h4 className="text-lg font-medium text-[#11181c]">
                                                        {chunk.similarity.toFixed(2)}
                                                    </h4>

                                                    <progress
                                                        value={chunk.similarity}
                                                        max="1"
                                                        className="w-full"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0 flex flex-col items-start gap-3">
                                                    <p className="text-sm text-[#687076] font-mono line-clamp-4">
                                                        {chunk.text}
                                                    </p>

                                                    <div className="flex flex-wrap gap-3 text-[#687076]">
                                                        <small>{chunk.filename}</small>
                                                        <small>
                                                            Chunk {chunk.chunk_index + 1}
                                                        </small>
                                                        <small>Page {chunk.page}</small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-[#687076] px-4 py-8">
                                            No chunks were retrieved.
                                        </p>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* PROMPT TAB */}
                    {activeTab === "prompt" && (
                        <div className="w-full flex flex-col gap-4 px-4 py-3">

                            <div className="flex items-center justify-between">
                                <h5 className="text-sm font-medium text-[#11181c]">
                                    LLM Prompt
                                </h5>

                                <span className="text-xs text-[#687076]">
                                    {response.trace.usage.prompt_tokens} tokens
                                </span>
                            </div>

                            {promptLoading ? (
                                <div className="w-full min-h-40 flex items-center justify-center">
                                    <p className="text-sm text-[#687076]">
                                        Loading prompt messages...
                                    </p>
                                </div>
                            ) : promptError ? (
                                <p className="text-sm text-red-500">
                                    {promptError}
                                </p>
                            ) : prompt.length > 0 ? (
                                prompt.map((message, index) => (
                                    <div
                                        key={index}
                                        className="w-full border border-black/10 rounded-md p-4 flex flex-col gap-2"
                                    >
                                        <span className="text-xs font-semibold uppercase text-[#687076]">
                                            {message.role}
                                        </span>

                                        <pre className="text-xs text-[#11181c] whitespace-pre-wrap font-mono break-words">
                                            {message.content}
                                        </pre>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-[#687076]">
                                    No prompt messages available.
                                </p>
                            )}

                        </div>
                    )}

                    {/* TIMING TAB */}
                    {activeTab === "timing" && (
                        <div className="w-full flex flex-col gap-5 px-4 py-5">

                            <h5 className="text-sm font-medium text-[#11181c]">
                                Processing Performance
                            </h5>

                            {[
                                {
                                    label: "Question Embedding",
                                    value: response.trace.timings.embedding_ms,
                                },
                                {
                                    label: "Retrieval",
                                    value: response.trace.timings.retrieval_ms,
                                },
                                {
                                    label: "Generation",
                                    value: response.trace.timings.generation_ms,
                                },
                                {
                                    label: "Total Processing",
                                    value: response.trace.timings.total_ms,
                                },
                            ].map((metric) => (
                                <div
                                    key={metric.label}
                                    className="w-full flex items-center justify-between border-b border-black/10 pb-3"
                                >
                                    <span className="text-sm text-[#687076]">
                                        {metric.label}
                                    </span>

                                    <span className="text-sm font-semibold text-[#11181c]">
                                        {formatDuration(metric.value)}
                                    </span>
                                </div>
                            ))}

                            <div className="grid grid-cols-2 gap-4 pt-2">

                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-[#687076]">
                                        Prompt Tokens
                                    </span>
                                    <span className="text-lg font-semibold text-[#11181c]">
                                        {response.trace.usage.prompt_tokens}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-[#687076]">
                                        Completion Tokens
                                    </span>
                                    <span className="text-lg font-semibold text-[#11181c]">
                                        {response.trace.usage.completion_tokens}
                                    </span>
                                </div>

                            </div>

                            <div className="flex flex-col gap-2 pt-3 border-t border-black/10">
                                <span className="text-xs text-[#687076]">
                                    Language Model
                                </span>
                                <span className="text-sm font-medium text-[#11181c]">
                                    {response.trace.llm_model}
                                </span>

                                <span className="text-xs text-[#687076] mt-2">
                                    Embedding Model
                                </span>
                                <span className="text-sm font-medium text-[#11181c]">
                                    {response.trace.embedding_model}
                                </span>
                            </div>

                        </div>
                    )}
                </>
            )}

        </div>
    );
}
