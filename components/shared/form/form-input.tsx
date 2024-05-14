"use client"

import { forwardRef } from "react"
import { useFormStatus } from "react-dom"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { FormErrors } from "./form-errors"

interface FormInputProps {
  id: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  errors?: Record<string, string[] | undefined>
  className?: string
  defaultValue?: string
  onBlur?: () => void
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  id,
  label,
  type,
  placeholder,
  required,
  disabled,
  errors,
  className,
  defaultValue = "",
  onBlur
}, ref) => {
  const { pending } = useFormStatus()

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        {label && (
          <Label 
            htmlFor={id}
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            {label}
          </Label>
        )}
        <Input
          onBlur={onBlur}
          defaultValue={defaultValue}
          ref={ref}
          required={required}
          name={id}
          id={id}
          placeholder={placeholder}
          type={type}
          disabled={pending || disabled}
          className={cn(
            "text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2",
            className,
          )}
          aria-describedby={`${id}-error`}
        />
      </div>
      <FormErrors
        id={id}
        errors={errors}
      />
    </div>
  )
})

FormInput.displayName = "FormInput"