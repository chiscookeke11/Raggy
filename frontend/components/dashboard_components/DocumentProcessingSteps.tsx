"use client"

import { useDocumentStore } from "@/store/document.store";
import { LoaderCircle } from "lucide-react";



interface DocumentProcessingStepsProps {
    documentId: string;
}



const stages = [
    { key: "extracting", label: "Extract" },
    { key: "cleaning", label: "Clean" },
    { key: "chunking", label: "Chunk" },
    { key: "embedding", label: "Embed" },
    { key: "storing", label: "Store" },
] as const;



type StageKey = typeof stages[number]["key"];



function formatDuration(ms?: number) {
    if (ms === undefined) return "—";

    if (ms < 1000) {
        return `${ms.toFixed(1)} ms`;
    }

    return `${(ms / 1000).toFixed(2)} s`;
}



export default function DocumentProcessingSteps({ documentId }: DocumentProcessingStepsProps) {

    const document = useDocumentStore((state) =>
        state.documents.find((item) => item.id === documentId)
    );


    if (!document) return null;


    const currentStageIndex = stages.findIndex(
        (stage) => stage.key === document.current_stage
    );

    return (
        <section className="w-full  grid grid-cols-5 place-items-start gap-4 " >

            {stages.map((stage, index) => {
                const timing = document.stage_timings?.[stage.key as StageKey];

                const isComplete =
                    document.status === "ready" ||
                    index < currentStageIndex ||
                    typeof timing === "number";

                const isFailed =
                    document.status === "failed" &&
                    index === currentStageIndex;

                const isActive =
                    document.status === "processing" &&
                    index === currentStageIndex;

                return (
                    <div
                        key={stage.key}
                        className="w-full flex flex-col items-start gap-1"
                    >
                        <progress
                            className={`w-full h-1.5 accent-blue-600 ${isFailed ? "accent-red-500" : ""
                                }`}
                            max="100"
                            {...(isComplete
                                ? { value: 100 }
                                : isFailed
                                    ? { value: 100 }
                                    : isActive
                                        ? {}
                                        : { value: 0 })}
                        />

                        <h5 className="mt-1.5 font-medium text-base text-black">
                            {stage.label}
                        </h5>

                        <p className={`text-sm ${isFailed
                            ? "text-red-500"
                            : isComplete
                                ? "text-green-600"
                                : isActive
                                    ? "text-blue-600"
                                    : "text-black/40"
                            }`}>
                            {isFailed
                                ? "Failed"
                                : isComplete
                                    ? formatDuration(timing)
                                    : isActive
                                        ? <span className="flex items-center gap-1.5 text-blue-600">
                                            <LoaderCircle size={14} className="animate-spin" />
                                            <span>Processing</span>
                                        </span>
                                        : "Waiting"}
                        </p>
                    </div>
                );
            })}
        </section>
    )
}