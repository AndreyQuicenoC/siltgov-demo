import { ReactElement } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ActionTooltipProps {
  /** Text shown in tooltip and used as accessible name when the control has no visible label */
  label: string;
  children: ReactElement;
  side?: "top" | "right" | "bottom" | "left";
}

/**
 * Wraps interactive controls (buttons, icon actions) with an operable Radix tooltip.
 * Does not alter layout or visual styles of the child.
 */
export function ActionTooltip({ label, children, side = "top" }: ActionTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={6}
        className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg max-w-[260px] leading-relaxed shadow-xl border-0 z-[200]"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
