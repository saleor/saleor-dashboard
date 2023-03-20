import {
  useDragResize,
  usePluginContext,
  useTheme as useGraphiQLTheme,
} from "@graphiql/react";
import { makeStyles, useTheme } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui/next";
import { useEffect } from "react";

export const useStyles = makeStyles(
  () => ({
    pre: {
      whiteSpace: "break-spaces",
    },
    main: {
      position: "relative",
    },
    scrollable: {
      // Overrides inline styling which breaks scroll
      // on doc explorer plugin
      "& > :first-child": {
        overflowY: "scroll !important",
      },
    },
  }),
  { name: "GraphiQL" },
);

export const useEditorStyles = () => {
  const pluginContext = usePluginContext();

  const pluginResize = useDragResize({
    defaultSizeRelation: 1 / 3,
    direction: "horizontal",
    initiallyHidden: pluginContext?.visiblePlugin ? undefined : "first",
    sizeThresholdSecond: 200,
    storageKey: "docExplorerFlex",
  });
  const editorResize = useDragResize({
    direction: "horizontal",
    storageKey: "editorFlex",
  });
  const editorToolsResize = useDragResize({
    defaultSizeRelation: 3,
    direction: "vertical",
    sizeThresholdSecond: 60,
    storageKey: "secondaryEditorFlex",
  });

  return {
    pluginResize,
    editorResize,
    editorToolsResize,
  };
};

export const useDashboardTheme = () => {
  const rootStyle = {
    "--font-size-body": vars.fontSize.bodyMedium,
    "--font-size-h2": vars.fontSize.headingLarge,
    "--font-size-h3": vars.fontSize.headingMedium,
    "--font-size-h4": vars.fontSize.headingSmall,
    "--font-weight-regular": vars.fontWeight.bodyLarge,
    "--font-size-hint": vars.fontSize.bodyEmpLarge,
    "--font-size-inline-code": vars.fontSize.bodySmall,
    "--color-base": vars.colors.background.plain,
    "--alpha-background-light": 0,
  } as React.CSSProperties;

  return { rootStyle };
};

export const useGraphiQLThemeSwitcher = () => {
  const theme = useTheme();
  const { theme: graphiqlTheme, setTheme: setGraphiqlTheme } =
    useGraphiQLTheme();

  useEffect(() => {
    if (theme.themeType !== graphiqlTheme) {
      setGraphiqlTheme(theme.themeType);
    }
  });
};
