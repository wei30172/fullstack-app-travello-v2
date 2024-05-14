import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

interface InfoTooltipProps {
  children: React.ReactNode
  description: string
  side?: "left" | "right" | "top" | "bottom"
  sideOffset?: number
}

export const InfoTooltip = ({
  children,
  description,
  side = "bottom",
  sideOffset = 0
}: InfoTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>
          {children}
        </TooltipTrigger>
        <TooltipContent
          sideOffset={sideOffset}
          side={side}
          className="text-xs max-w-[220px] break-words"
        >
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}