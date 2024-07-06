interface AskAIParams {
  location: string
  days: number
  language: string
}

export const getAIItinerary = async (params: AskAIParams, signal: AbortSignal) => {
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