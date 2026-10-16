import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { SkipToContent } from "./components/SkipToContent";

export default function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <SkipToContent />
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: { fontSize: "12px", padding: "8px 12px", minHeight: "unset" },
        }}
      />
    </TooltipProvider>
  );
}