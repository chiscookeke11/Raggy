
"use client";

import { getDocumentChunks } from "@/services/document.service";
import { useDocumentStore } from "@/store/document.store";
import { DocumentChunk } from "@/types/types";
import { FormEvent, useEffect, useState } from "react";
import Button from "../ui/CustomButton";

export default function Chunks() {
    const [chunks, setChunks] = useState<DocumentChunk[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState("");
    const [limit, setLimit] = useState("50");
    const [offset, setOffset] = useState("0");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadedDocument = useDocumentStore((state) =>
        state.documents.find(
            (document) => document.id === state.activeDocumentId
        ) ?? null
    );

    // Fetch chunks from the backend
    const fetchChunks = async (
        params: {
            search?: string;
            page?: number;
            limit?: number;
            offset?: number;
        } = {}
    ) => {
        if (!uploadedDocument) return;

        setLoading(true);
        setError(null);

        try {
            const chunksData = await getDocumentChunks(
                uploadedDocument.id,
                params
            );

            setChunks(chunksData);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch chunks"
            );
        } finally {
            setLoading(false);
        }
    };

    // Fetch all chunks when the selected document changes
    useEffect(() => {
        if (!uploadedDocument?.id) {
            setChunks([]);
            return;
        }

        fetchChunks();
    }, [uploadedDocument?.id]);

    // Apply custom retrieval filters
    const handleApplyFilters = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        fetchChunks({
            search: search.trim() || undefined,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
        });
    };

    // Reset filters and retrieve all chunks
    const handleResetFilters = () => {
        setSearch("");
        setPage("");
        setLimit("50");
        setOffset("0");

        fetchChunks();
    };

    return (
        <div className="bg-white w-full max-w-7xl mx-auto  relative my-28 py-10 space-y-4">

            <div className="w-0.5 h-full bg-[#11181c] absolute top-[50%] left-0 translate-y-[-50%]" />

            <div className="w-0.5 h-full bg-[#11181c] absolute top-[50%] right-0 translate-y-[-50%]" />

            <div className="h-0.5 w-full bg-[#11181c] absolute top-0 left-[50%] translate-x-[-50%]" />

            <div className="h-0.5 w-full bg-[#11181c] absolute bottom-0 left-[50%] translate-x-[-50%]" />

            <div className="w-full flex flex-col items-start gap-5 py-1 px-7">

                <div className="md:space-y-1">
                    <h2 className="text-xl md:text-3xl font-semibold">
                        View Chunks
                    </h2>
                </div>

                {/* Customize Retrieval */}
                <form
                    onSubmit={handleApplyFilters}
                    className="w-full bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg p-4 space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-[#11181c]">
                            Filters
                        </h3>

                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="text-xs text-blue-600 hover:underline cursor-pointer"
                        >
                            Reset filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* Search */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-[#687076]">
                                Search chunks
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="e.g. machine learning"
                                className="w-full border border-[#d0d5dd] rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Page */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-[#687076]">
                                Page number
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={page}
                                onChange={(e) => setPage(e.target.value)}
                                placeholder="All pages"
                                className="w-full border border-[#d0d5dd] rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Limit */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-[#687076]">
                                Number of chunks
                            </label>
                            <select
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                className="w-full border border-[#d0d5dd] rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="10">10 chunks</option>
                                <option value="25">25 chunks</option>
                                <option value="50">50 chunks</option>
                                <option value="100">100 chunks</option>
                                <option value="200">200 chunks</option>
                            </select>
                        </div>

                        {/* Offset */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-[#687076]">
                                Offset
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={offset}
                                onChange={(e) => setOffset(e.target.value)}
                                placeholder="0"
                                className="w-full border border-[#d0d5dd] rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                    </div>

                    <Button
                        type="submit"
                        disabled={loading || !uploadedDocument}
                        className="bg-[#11181c] text-white text-sm px-5 py-2 disabled:opacity-50 cursor-pointer "
                    >
                        {loading ? "Fetching..." : "Apply Filters"}
                    </Button>
                </form>

            </div>

            {/* Chunks */}
            <div className="w-full border-t py-3.5 flex items-start flex-col gap-6">

                {error && (
                    <p className="text-sm text-red-500 px-5">{error}</p>
                )}

                {loading ? (
                    <p className="text-sm text-[#687076] px-5">
                        Fetching chunks...
                    </p>
                ) : chunks.length > 0 ? (
                    chunks.map((c, i) => (
                        <div
                            key={c.id}
                            className={`w-full px-5 py-5 flex items-start gap-6 ${i === 0 ? "" : "border-t"
                                }`}
                        >
                            <h4 className="font-semibold text-base text-[#11181c]">
                                {c.chunk_index + 1}
                            </h4>

                            <div className="flex flex-col items-start gap-2 min-w-0">
                                <p className="text-[#11181c] text-xs md:text-sm">
                                    {c.text}
                                </p>

                                <div className="w-full flex flex-wrap items-center gap-3 text-[#687076]">
                                    <small>Page: {c.page}</small>
                                    <small>Characters: {c.char_count}</small>
                                    <small>Token count: {c.token_count}</small>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-[#687076] px-5">
                        No chunks found.
                    </p>
                )}

            </div>

        </div>
    );
}
