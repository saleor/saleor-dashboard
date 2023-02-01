import {
  useDragResize,
  usePluginContext,
  useTheme as useGraphiQLTheme,
} from "@graphiql/react";
import { makeStyles, useTheme } from "@saleor/macaw-ui";
import { useEffect } from "react";

export const useStyles = makeStyles(
  () => ({
    pre: {
      whiteSpace: "break-spaces",
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
  const theme = useTheme();

  const rootStyle = {
    "--font-size-body": theme.typography?.body2.fontSize,
    "--font-size-h2": theme.typography?.h3.fontSize,
    "--font-size-h3": theme.typography?.h3.fontSize,
    "--font-size-h4": theme.typography?.h4.fontSize,
    "--font-size-hint": theme.typography?.caption.fontSize,
    "--font-size-inline-code": theme.typography?.caption.fontSize,
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
