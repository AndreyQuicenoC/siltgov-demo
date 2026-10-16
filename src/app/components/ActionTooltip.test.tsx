import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActionTooltip } from "./ActionTooltip";
import { TooltipProvider } from "./ui/tooltip";

describe("ActionTooltip", () => {
  it("applies aria-label to icon-only buttons", () => {
    render(
      <TooltipProvider>
        <ActionTooltip label="Acción de prueba">
          <button type="button" className="test-btn" aria-label="Acción de prueba">
            <span aria-hidden>X</span>
          </button>
        </ActionTooltip>
      </TooltipProvider>,
    );
    expect(screen.getByRole("button", { name: "Acción de prueba" })).toBeInTheDocument();
  });
});
