import { useTranslations } from "next-intl"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { handleSelectContentRef } from "@/lib/utils"

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
  const tUi = useTranslations("BoardForm.ui")

  const languages = [
    { label: tUi("language.english"), value: "English" },
    { label: tUi("language.traditionalChinese"), value: "Traditional Chinese" },
    { label: tUi("language.simplifiedChinese"), value: "Simplified Chinese" },
    { label: tUi("language.spanish"), value: "Spanish" },
    { label: tUi("language.french"), value: "French" },
    { label: tUi("language.japanese"), value: "Japanese" }
  ]
  
  return (
    <Select
      disabled={isStreaming}
      onValueChange={setLanguage}
      value={language}
    >
      <SelectTrigger className="w-[500px]">
        <SelectValue placeholder={tUi("selectLanguage")} />
      </SelectTrigger>
      <SelectContent ref={handleSelectContentRef} >
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