import { useDragResize, usePluginContext, useTheme as useGraphiQLTheme } from "@graphiql/react";
import { makeStyles } from "@saleor/macaw-ui";
import { useTheme, vars } from "@saleor/macaw-ui-next";
import { useEffect } from "react";

export const useStyles = makeStyles(
  () => ({
    pre: {
      whiteSpace: "break-spaces",
      maxHeight: 450,
      overflowY: "scroll",
      marginBottom: 0,
      marginTop: -26,
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
    graphiqlSessions: {
      margin: "0 !important",
      marginRight: "var(--px-16) !important",
      paddingTop: "var(--px-16)",
      borderRadius: "0 !important",
    },
    graphiqlEditors: {
      borderRadius: "0 !important",
    },
    graphiqlContainer: {
      fontVariantLigatures: "none",
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

/**
 * GraphiQL is sized and coloured through CSS custom properties. React's
 * `CSSProperties` does not know about custom properties, so intersect it to
 * keep both the `style={...}` assignability and the indexed reads.
 */
type DashboardThemeStyle = React.CSSProperties &
  Record<
    | "--font-size-body"
    | "--font-size-h2"
    | "--font-size-h3"
    | "--font-size-h4"
    | "--font-weight-regular"
    | "--font-size-hint"
    | "--font-size-inline-code"
    | "--color-base",
    string
  >;

export const useDashboardTheme = () => {
  const {
    themeValues: {
      colors: { background },
    },
  } = useTheme();
  const match = background.default1.match(/hsla\(([^)]+)\)/);
  const rootStyle: DashboardThemeStyle = {
    "--font-size-body": vars.fontSize[4],
    "--font-size-h2": vars.fontSize[6],
    "--font-size-h3": vars.fontSize[5],
    "--font-size-h4": vars.fontSize[4],
    "--font-weight-regular": vars.fontWeight.regular,
    "--font-size-hint": vars.fontSize[5],
    "--font-size-inline-code": vars.fontSize[3],
    "--color-base": match ? match[1] : background.default1,
  };

  return { rootStyle };
};

export const useGraphiQLThemeSwitcher = () => {
  const theme = useTheme();
  const { setTheme: setGraphiQLTheme } = useGraphiQLTheme();

  useEffect(() => {
    setGraphiQLTheme(theme.theme === "defaultDark" ? "dark" : "light");
  });
};
