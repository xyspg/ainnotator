import { useLocalStorage } from "./use-localstorage";

export const useWriteKey = () =>
  useLocalStorage(
    "segment_playground_write_key",
    process.env.NEXT_PUBLIC_SEGMENT_WRITEKEY,
  );

export const useCDNUrl = () =>
  useLocalStorage("segment_playground_cdn_url", "https://cdn.segment.com");
