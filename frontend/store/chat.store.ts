
import { create } from "zustand";
import { ChatResponse } from "@/types/types";

interface ChatState {
    latestResponse: ChatResponse | null;
    setLatestResponse: (response: ChatResponse | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    latestResponse: null,

    setLatestResponse: (response) =>
        set({ latestResponse: response }),
}));
