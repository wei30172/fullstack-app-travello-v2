import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const languages = [
  { label: "English", value: "English" },
  { label: "Traditional Chinese", value: "Traditional Chinese" },
  { label: "Simplified Chinese", value: "Simplified Chinese" },
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
  { label: "Japanese", value: "Japanese" }
]

interface LanguageSelectorProps {
  language: string
  setLanguage: (value: string) => void
  isStreaming: boolean
}

export const LanguageSelector = ({
  language,
  setLanguage,
  isStreaming
}:LanguageSelectorProps) => {
  return (
    <Select
      disabled={isStreaming}
      onValueChange={setLanguage}
      value={language}
    >
      <SelectTrigger className="w-[500px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem
            key={lang.value}
            value={lang.value}
            className="text-sm"
          >
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}