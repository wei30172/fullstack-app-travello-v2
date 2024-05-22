import OpenAI from "openai"
import { NextResponse } from "next/server"
// import { OpenAIStream, StreamingTextResponse } from "ai"

export const runtime = "edge"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const generateInstructionMessage = (
  location: string,
  days: number,
  language: string
): string => {
  return `
    You are an expert travel planner.
    Please generate a structured JSON object that represents a day-by-day itinerary for a trip to ${location}, which is ${days} days long.
    Each day should be listed as an array of specific attractions or activities planned for that day in ${location}.
    Your suggestions should consider practical travel times between locations and include a variety of cultural, historical, and recreational activities to provide a well-rounded experience.

    Format the response as a JSON object with each day labeled from "Day 1" to "Day ${days}", and include the activities for each day. For example:
    Ensure the activities are ordered by time, from earliest in the morning to latest at night.

    {
      Day 1: ["08:00 Activity 1", "10:00 Activity 2", "12:30 Activity 3", "14:00 Activity 4", "16:00 Activity 5", "18:30 Activity 6", "20:00 Activity 7" ...]
      Day 2: ["09:00 Activity 1", "11:30 Activity 2", "13:00 Activity 3", "15:30 Activity 4", "17:00 Activity 5", "19:00 Activity 6" ...]
      ...
    }
    
    The itinerary will be provided in the ${language}.
    It is crucial that the activities for each day are sorted chronologically. The JSON object should reflect the sequence from morning to evening without requiring additional sorting.
    Please focus solely on the trip details and exclude any unrelated text from your response. This JSON object will be used directly in an application, so accuracy and clarity are crucial.
    `

    // return `
    // You are an expert travel planner.
    // Please generate a structured JSON object that represents a day-by-day itinerary for a trip to ${location}, which is ${days} days long.
    // Each day should be listed as an array of specific attractions or activities planned for that day in ${location}.
    // Your suggestions should consider practical travel times between locations and include a variety of cultural, historical, and recreational activities to provide a well-rounded experience.

    // Format the response as a JSON object with each day labeled from "Day 1" to "Day ${days}", and include the activities for each day. For example:
    // Ensure the activities are ordered by time, from earliest in the morning to latest at night.

    // {
    //   Day 1: ["08:00 Activity 1", "12:00 Activity 2", "15:00 Activity 3" ...]
    //   Day 2: ["09:00 Activity 1", "11:00 Activity 2", "14:00 Activity 3" ...]
    //   ...
    // }
    
    // The itinerary will be provided in the ${language}.
    // Please focus solely on the trip details and exclude any unrelated text from your response. This JSON object will be used directly in an application, so accuracy and clarity are crucial.
    // `
}

// api/board/ask-ai
export async function POST(
  req: Request
) {
  try {
    const { location, days, language } = await req.json()
    // console.log({ location, days, language })

    const instructionMessage = generateInstructionMessage(location, days, language)

    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      response_format: {"type": "json_object"},
      // model: "gpt-4-vision-preview",
      // stream: true,
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: [{ type: "text", text: instructionMessage }]
      }]
    })

    const content = response.choices[0].message.content
    // console.log({content})
    return new NextResponse(content, { status: 200 } )

    // const stream = OpenAIStream(response)
    // return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("[ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}