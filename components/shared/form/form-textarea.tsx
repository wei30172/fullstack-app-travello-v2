"use client"

import { useFormStatus } from "react-dom"
import { KeyboardEventHandler, forwardRef } from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormErrors } from "./form-errors"

interface FormTextareaProps {
  id: string
  value?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  errors?: Record<string, string[] | undefined>
  className?: string
  onBlur?: () => void
  onClick?: () => void
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined
  defaultValue?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
  id,
  value,
  label,
  placeholder,
  required,
  disabled,
  errors,
  onBlur,
  onClick,
  onChange,
  onKeyDown,
  className,
  defaultValue
}, ref) => {
  const { pending } = useFormStatus()

  return (
    <div className="space-y-2 w-full">
      <div className="space-y-1 w-full">
        {label ? (
          <Label
            htmlFor={id}
            className="text-xs font-semibold text-teal-900"
          >
            {label}
          </Label>
        ) : null}
        <Textarea
          onKeyDown={onKeyDown}
          onChange={onChange}
          onBlur={onBlur}
          onClick={onClick}
          ref={ref}
          required={required}
          placeholder={placeholder}
          name={id}
          id={id}
          value={value}
          disabled={pending || disabled}
          className={cn(
            "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
            className
          )}
          aria-describedby={`${id}-error`}
          defaultValue={defaultValue}
        />
      </div>
      <FormErrors
        id={id}
        errors={errors}
      />
    </div>
  )
})

FormTextarea.displayName = "FormTextarea"