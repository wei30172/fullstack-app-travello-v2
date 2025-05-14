import { internalApiFetcher } from "@/lib/fetcher"

interface AskAIParams {
  location: string
  days: number
  language: string
}

type AIItineraryResponse =
  | { ok: true; body: ReadableStream<Uint8Array> | null }
  | { ok: false; error: string; aborted?: boolean }

export const getAIItinerary = async (
  params: AskAIParams,
  signal: AbortSignal
): Promise<AIItineraryResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/board/get-ai-itinerary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params),
      signal
    })
    // console.log(res)

    if (!res.ok) {
      throw new Error("The OpenAI API key is currently not available for use.")
    }

    return { ok: true, body: res.body }
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      console.log("Fetch aborted:", (error as Error).message)
      return { ok: false, error: "Fetch aborted by the user.", aborted: true }
    } else {
      console.error("Error in askAI:", (error as Error).message)
      return { ok: false, error: (error as Error).message || "Failed to connect to AI service" }
    }
  }
}

interface GetSignedURLParams {
  fileType: string
  fileSize: number
  checksum: string
}

type GetSignedURLResponse =
  | { ok: true; url: string }
  | { ok: false; error: string }

interface GetSignedURLApiResponse {
  url: string
}

export const getSignedURL = async (
  params: GetSignedURLParams
): Promise<GetSignedURLResponse> => {
  try {
    const res = await internalApiFetcher<GetSignedURLApiResponse>({
      endpoint: "api/board/upload-to-s3",
      options: {
        method: "POST",
        body: JSON.stringify(params)
      }
    })

    return { ok: true, url: res.url }
  } catch (error) {
    console.error("Error in getSignedURL:", (error as Error).message)
    return {
      ok: false,
      error: (error as Error).message || "Failed to connect to AWS service"
    }
  }
}