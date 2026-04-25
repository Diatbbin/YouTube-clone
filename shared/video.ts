export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing" | "processed" | "failed",
    title?: string,
    description?: string,
    thumbnailFilename?: string,
    processingStartTime?: number,
    lastStatusUpdateTime?: number,
    retryCount?: number,
    error?: string | null,
}