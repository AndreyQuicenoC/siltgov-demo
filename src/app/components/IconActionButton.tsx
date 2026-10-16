import { ReactNode, ButtonHTMLAttributes } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export interface IconActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visible tooltip and accessible name for icon-only controls */
  label: string;
  children: ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
}

/**
 * Icon-only action with Radix tooltip (keyboard/focus operable) and aria-label.
 * Preserves existing visual classes from callers.
 */
export function IconActionButton({
  label,
  children,
  tooltipSide = "top",
  className = "",
  type = "button",
  ...rest
}: IconActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type={type}
          className={className}
          aria-label={label}
          {...rest}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side={tooltipSide}
        sideOffset={6}
        className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg max-w-[240px] leading-relaxed shadow-xl border-0"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
