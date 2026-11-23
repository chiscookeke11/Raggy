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


export interface DocumentChunk {
    id: string;
    document_id: string;
    chunk_index: string;
    page: number;
    text: string;
    char_count: number;
    token_count: number;
    embedding_data: number
}


export interface ChatRequest {
    question: string;
    top_k: number;
    document_ids: string[]
}


export interface ChatTraceChunk {
    rank: number;
    chunk_id: string;
    document_id: string;
    filename: string;
    page: number;
    chunk_index: number;
    text: string;
    distance: number;
    similarity: number;
}

export interface ChatTrace {
    question: string;
    llm_model: string;
    embedding_model: string;
    embedding_dim: number;
    top_k: number;
    chunks: ChatTraceChunk[];
    reranked: boolean;
    prompt: {
        role: string;
        content: string;
    }[];
    timings: {
        embedding_ms: number;
        retrieval_ms: number;
        generation_ms: number;
        total_ms: number;
    };
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
    };
}

export interface ChatResponse {
    chat_id: string;
    question: string;
    answer: string;
    trace: ChatTrace;
    created_at: string;
}


export interface PromptMessage {
    role: string;
    content: string;
}