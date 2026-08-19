// Saleor raises UNIQUE on identifier with:
// "App with the same identifier is already installed: {app.name}"
const SALEOR_UNIQUE_IDENTIFIER_PATTERN = /already installed:\s*(.+)$/i;

export const findInstalledAppFromUniqueError = <
  T extends {
    name: string | null;
  },
>(
  installedApps: T[],
  error: {
    field?: string | null;
    message?: string | null;
  },
): T | undefined => {
  if (error.field !== "identifier" || !error.message) {
    return undefined;
  }

  const match = error.message.match(SALEOR_UNIQUE_IDENTIFIER_PATTERN);

  if (!match) {
    return undefined;
  }

  const appName = match[1].trim();

  return installedApps.find(app => app.name === appName);
};
