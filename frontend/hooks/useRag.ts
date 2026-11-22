// src/hooks/useRag.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useUpload() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: api.upload,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
    });
}