import { createSVGWrapper } from "./SVGWrapper";

/**
 * @deprecated This icon is deprecated. Please use Lucide React icons instead.
 * @see https://lucide.dev/ for available icons
 * @example
 * import { Globe } from "lucide-react";
 * // Use <Globe /> instead
 */
export const EnvironmentIcon = createSVGWrapper(
  <>
    <path
      d="M3 10h18M3 10v5a2 2 0 0 0 2 2h7m-9-7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5m0 0v5a2 2 0 0 1-2 2h-7m0 0v4m0 0H6m6 0h7"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 13.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0-7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
      fill="currentColor"
    />
  </>
);
