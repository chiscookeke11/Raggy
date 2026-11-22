

import { apiRequest } from "@/lib/api";
import { HealthResponse } from "@/types/types";


export async function checkBackendHealth(): Promise<HealthResponse> {

    return apiRequest<HealthResponse>("/health")

}