/**
 * WCAG 2.4.1 Bypass Blocks — skip link to main landmark.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-3 focus:left-3 focus:rounded-md focus:bg-[#1C5BB8] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
    >
      Saltar al contenido principal
    </a>
  );
}
