import { useTranslations } from "next-intl"
import { MAX_FREE_ASKAI } from "@/constants/board"
import { getAvailableAskAiCount } from "@/lib/actions/user-limit"
import { CountType } from "@/lib/database/types"

import { FiPause } from "react-icons/fi"
import { Button } from "@/components/ui/button"
// import Markdown from "react-markdown"
import { LanguageSelector } from "@/components/shared/AI-response/language-selector"
import { AvailableCount } from "@/components/shared/AI-response/available-count"

interface AIResponseProps {
  language: string
  setLanguage: (value: string) => void
  isStreaming: boolean
  openAIResponse: string | ""
  tripItinerary: TripItinerary | null
  applySuggestions: () => void
  handleAskAI: () => void
  handleStop: () => void
  isUpdating: boolean
}

interface TripItinerary {
  [key: string]: string[]
}

const AIResponse = ({
  language,
  setLanguage,
  isStreaming,
  openAIResponse,
  tripItinerary,
  applySuggestions,
  handleAskAI,
  handleStop,
  isUpdating
}: AIResponseProps) => {
  const tUi = useTranslations("BoardForm.ui")

  const itineraryElements = tripItinerary && Object.entries(tripItinerary).map(([attraction, activities], index) => (
    <div key={index}>
      <h3 className="font-semibold">{attraction}</h3>
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>－{activity}</li>
        ))}
      </ul>
    </div>
  ))
  
  return (
    <>
      <div className="flex items-center justify-center gap-2">
      {
        <LanguageSelector
          language={language}
          setLanguage={setLanguage}
          isStreaming={isStreaming}
        />
      }
      {
        !isStreaming &&
        <Button
          className="w-full my-2"
          type="button"
          onClick={handleAskAI}
          disabled={isUpdating}
          variant="primary"
        >
          {isUpdating ? tUi("updating") : tUi("askAI")}
        </Button>
      }
      </div>
      <AvailableCount
        queryKey={CountType.ASK_AI_COUNT}
        queryFn={getAvailableAskAiCount}
        maxCount={MAX_FREE_ASKAI}
        label={tUi("aiUsesRemaining", { remaining: "{remaining}" })}
        description={tUi("aiUsesDescription", { max: MAX_FREE_ASKAI })}
      />
      {
        isStreaming &&
        <Button
          className="w-full my-2"
          type="button"
          onClick={handleStop}
          variant="outline"
        >
          <FiPause />
        </Button>
      }
      {
        isStreaming && openAIResponse !== null &&
        <div className="streaming-animation mb-4">
          <p className="text-center">{tUi("askingAI")}</p>
        </div>
      }
      {
        tripItinerary !== null &&
        <div className="border-t border-gray-300 pt-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold mb-2">{tUi("aiSuggestions")}</h2>
            <Button
              className="w-1/2 m-2"
              variant="primary"
              type="button"
              onClick={applySuggestions}
              disabled={isUpdating}
            >
              {isUpdating ? tUi("updating") : tUi("addToCards")}
            </Button>
          </div>
          {itineraryElements}
          <div className="flex justify-end items-center">
            <Button
              className="w-1/2 m-2"
              variant="primary"
              type="button"
              onClick={applySuggestions}
              disabled={isUpdating}
            >
              {isUpdating ? tUi("updating") : tUi("addToCards")}
            </Button>
          </div>
          {/* <Markdown>{openAIResponse}</Markdown> */}
        </div>
      }
    </>
  )
}

export default AIResponse