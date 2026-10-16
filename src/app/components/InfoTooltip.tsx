import { ReactNode } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface InfoTooltipProps {
  content: string;
  size?: number;
  className?: string;
}

/**
 * Small info icon that shows a contextual tooltip on hover.
 * Use next to field labels or status badges to provide non-redundant context.
 */
export function InfoTooltip({ content, size = 12, className = "" }: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center ml-1 text-gray-350 hover:text-[#1C5BB8] transition-colors focus:outline-none ${className}`}
          tabIndex={-1}
          aria-label="Información adicional"
        >
          <Info size={size} className="text-gray-400 hover:text-[#1C5BB8]" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        sideOffset={6}
        className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg max-w-[230px] leading-relaxed shadow-xl border-0"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

interface StatusTooltipProps {
  children: ReactNode;
  description: string;
}

/**
 * Wraps a status badge with a contextual tooltip explaining what the status means.
 */
export function StatusTooltip({ children, description }: StatusTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help">{children}</span>
      </TooltipTrigger>
      <TooltipContent
        sideOffset={6}
        className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg max-w-[230px] leading-relaxed shadow-xl border-0"
      >
        {description}
      </TooltipContent>
    </Tooltip>
  );
}