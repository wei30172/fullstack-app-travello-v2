import { FiPause } from "react-icons/fi"
import { Button } from "@/components/ui/button"
// import Markdown from "react-markdown"
import LanguageSelector from "./language-selector"

interface AIResponseProps {
  language: string
  setLanguage: (value: string) => void
  isStreaming: boolean
  openAIResponse: string | ""
  tripItinerary: TripItinerary | null
  applySuggestions: () => void
  handleStop: () => void
  askAI: () => void
  pending: boolean
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
  handleStop,
  askAI,
  pending,
}: AIResponseProps) => {
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
          onClick={askAI}
          disabled={pending}
          variant="primary"
        >
          {pending ? "Updating..." : "Ask AI"}
        </Button>
      }
      </div>
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
        <div className="streaming-animation">
          <p className="text-center">Asking AI...</p>
        </div>
      }
      {
        tripItinerary !== null &&
        <div className="border-t border-gray-300 pt-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold mb-2">AI suggestions</h2>
            <Button
              className="w-1/2 my-2"
              type="button"
              onClick={applySuggestions}
              disabled={pending}
              variant="primary"
            >
              {pending ? "Updating..." : "Add to Cards"}
            </Button>
          </div>
          {itineraryElements}
          {/* <Markdown>{openAIResponse}</Markdown> */}
        </div>
      }
    </>
  )
}

export default AIResponse