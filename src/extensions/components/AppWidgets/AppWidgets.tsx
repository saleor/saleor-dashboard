import { type ExtensionWithParams } from "@dashboard/extensions/types";
import { type AppDetailsUrlMountQueryParams } from "@dashboard/extensions/urls";
import { type ThemeType } from "@saleor/app-sdk/app-bridge";
import { Box } from "@saleor/macaw-ui-next";
import { useRef } from "react";

import { AppWidgetExtensionItem } from "./AppWidgetExtensionItem";

type AppWidgetsProps = {
  extensions: ExtensionWithParams[];
  params: AppDetailsUrlMountQueryParams;
};

const sortExtensions = (extensions: ExtensionWithParams[]): ExtensionWithParams[] =>
  [...extensions].sort((a, b) => {
    const byApp = (a.app.name ?? "").localeCompare(b.app.name ?? "");

    if (byApp !== 0) {
      return byApp;
    }

    return a.label.localeCompare(b.label);
  });

export const AppWidgets = ({ extensions, params }: AppWidgetsProps) => {
  const themeRef = useRef<ThemeType>();
  const sortedExtensions = sortExtensions(extensions);

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {sortedExtensions.map(extension => (
        <AppWidgetExtensionItem
          key={extension.id}
          extension={extension}
          params={params}
          theme={themeRef.current}
        />
      ))}
    </Box>
  );
};
