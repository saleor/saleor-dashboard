/**
 * What browsers, and Vite for a section's stylesheet, say when lazily loaded code couldn't be
 * downloaded. An error thrown while downloaded code runs is a bug and doesn't match.
 */
const DOWNLOAD_FAILED_MESSAGES = [
  "Failed to fetch dynamically imported module", // Chrome, Edge
  "error loading dynamically imported module", // Firefox
  "Importing a module script failed", // Safari
  "Unable to preload CSS", // Vite
];

/**
 * Lazily loaded code, such as a section of the dashboard, couldn't be downloaded. It can't open
 * until the page reloads: browsers keep a failed module download failed.
 */
export const isSectionDownloadFailure = (error: unknown): boolean =>
  error instanceof Error &&
  DOWNLOAD_FAILED_MESSAGES.some(message => error.message.startsWith(message));
