import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://api.fpt.ai/hmi/tts/v5",
  headers: {
    "api-key": (import.meta.env.VITE_ZALO_API_KEY as string) || "",
  },
});
