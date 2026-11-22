export interface HealthResponse {
    status: "ok" | "error",
    ollama_reachable: boolean,
    embedding_model_ready: boolean,
    llm_model_ready: boolean,
    vector_count: number
}



export type DocumentStatus =
    | "processing"
    | "ready"
    | "failed"
    | "pending";

export interface DocumentStageTimings {
    extracting?: number;
    cleaning?: number;
    chunking?: number;
    embedding?: number;
    storing?: number;
    [stage: string]: number | undefined;
}

export interface Document {
    id: string;
    filename: string;
    file_type: string;
    size_bytes: number;
    page_count: number;
    chunk_count: number;
    embedded_count: number;
    status: DocumentStatus;
    current_stage: string;
    error: string | null;
    stage_timings: DocumentStageTimings;
    created_at: string;
}

export type DocumentUploadResponse = Document;