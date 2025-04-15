import { useTranslations } from "next-intl"

import { FiAlertTriangle } from "react-icons/fi"
import { FormWrapper } from "@/components/shared/form/form-wrapper"

export const ErrorCard = () => {
  const t = useTranslations("ErrorCard")

  return (
    <FormWrapper
      headerLabel={t("header")}
      backButtonLabel={t("backButton")}
      backButtonHref="/signin"
    >
      <div className="w-full flex justify-center items-center">
        <FiAlertTriangle className="text-destructive" />
      </div>
    </FormWrapper>
  )
}
