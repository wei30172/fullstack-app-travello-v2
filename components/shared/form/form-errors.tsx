import { FiAlertCircle } from "react-icons/fi"

interface FormErrorsProps {
  id: string
  errors?: Record<string, string[] | undefined>
}

export const FormErrors = ({
  id,
  errors
}: FormErrorsProps) => {

  if (!errors) {
    return null
  }
  
  return (
    <div
      id={`${id}-error`}
      aria-live="polite"
      className="mt-2 text-xs text-red-600"
    >
      {errors?.[id]?.map((error: string) => (
        <div 
          key={error}
          className="flex items-center font-medium p-1 mb-2 border-red-600 bg-red-100 rounded-lg"
        >
          <FiAlertCircle className="h-5 w-5 mr-2 text-red-600" />
          {error}
        </div>
      ))}
    </div>
  )
}