import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const handleSelectContentRef = (ref: HTMLDivElement | null) => {
  if (!ref) return
  ref.ontouchstart = (e: TouchEvent) => { e.preventDefault() }
}