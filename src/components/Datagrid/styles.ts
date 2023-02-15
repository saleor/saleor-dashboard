import { Theme } from "@glideapps/glide-data-grid";
import { makeStyles, useTheme } from "@saleor/macaw-ui";
import { themes } from "@saleor/macaw-ui/next";
import { useMemo } from "react";

export const cellHeight = 36;

const useStyles = makeStyles(
  theme => {
    const rowActionSelected = {
      background: theme.palette.background.paper,
      color: theme.palette.saleor.main[1],
    };
    const activeBorderColor =
      theme.palette.saleor.theme === "light" ? "#D4D4D4" : "#232323";

    return {
      actionBtnBar: {
        position: "absolute",
        zIndex: 1,
        background: theme.palette.background.paper,
        borderRadius: 8,
        // Right and left toolbars
        width: `calc(100% - 64px - ${cellHeight} - 1px)`,
        marginTop: 1,
        marginLeft: 50,
        height: cellHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(1),
      },
      columnPicker: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: cellHeight,
      },
      ghostIcon: {
        color: theme.palette.saleor.main[3],
      },
      portal: {
        "& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
          {
            appearance: "none",
            margin: 0,
          },
        "& input[type=number]": {
          appearance: "textfield",
        },
        "& .clip-region": {
          border: `1px solid ${theme.palette.saleor.main[1]}`,
        },
        "& .gdg-growing-entry": {
          flex: 1,
          marginTop: 0,
        },
        "& .gdg-style": {
          background: theme.palette.background.paper,
          border: "none",
          // Setting these with !important because we never intend to style
          // this particular element, like, never ever
          boxShadow: "none !important",
          padding: "0 !important",
        },
        "& input, & textarea": {
          appearance: "none",
          background: "none",
          border: "none",
          fontSize: themes.defaultLight.fontSize.bodySmall,
          letterSpacing: "0.015em",
          lineHeight: themes.defaultLight.lineHeight.bodySmall,
          fontWeight: themes.defaultLight.fontWeight.bodySmall,
          padding: themes.defaultLight.space[3],
          outline: 0,
        },
        '& input[type="number"]': {
          textAlign: "right",
          width: "100%",
        },
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2,
      },
      datagrid: {
        "& .dvn-scroller": {
          overscrollBehaviorX: "none",
        },
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderRadius: 0,
        boxSizing: "content-box",
        width: "100%",
        paddingBottom: "1px",
        color: "red",
      },
      root: {
        position: "relative",
      },
      rowActionBar: {
        height: "100%",
        background: theme.palette.background.paper,
        borderLeft: `1px solid ${activeBorderColor}`,
        width: 36,
      },
      rowActionBarScrolledToRight: {
        borderLeftColor: theme.palette.divider,
      },
      rowAction: {
        "&:hover, $rowActionSelected": {
          rowActionSelected,
        },
        "&:not(:last-child)": {
          marginBottom: -1,
        },
        border: `1px solid ${theme.palette.divider}`,
        borderLeftColor: activeBorderColor,
        borderRight: "none",
        cursor: "pointer",
        color: theme.palette.saleor.main[5],
        marginLeft: -1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: `calc(${cellHeight}px - 1px)`,
      },
      rowActionScrolledToRight: {
        borderLeftColor: theme.palette.divider,
      },
      columnGroupFixer: {
        position: "absolute",
        top: 1,
        left: 0,
        height: cellHeight,
        width: 10,
        borderLeft: 0,
        background: theme.palette.background.paper,
      },
      editorContainer: {
        position: "relative",
        height: "100%",
      },
      rowActionBarShadow: {
        height: "100%",
        width: 1,
        position: "absolute",
        zIndex: -1,
        transition: theme.transitions.create("box-shadow", {
          duration: theme.transitions.duration.short,
        }),
        boxShadow: "-1px 0px 12px transparent",
      },
      rowActionBarShadowActive: {
        boxShadow: "-1px 0px 12px rgba(0, 0, 0, 0.80)",
      },
      rowActionSelected,
      cardContentRoot: {
        padding: "0 0 2.4rem 0",
        flex: 1,
      },
    };
  },
  { name: "Datagrid" },
);

export const useFullScreenStyles = makeStyles<ReturnType<typeof useStyles>>(
  () => ({
    fullScreenContainer: props => ({
      [`& .${props.root}`]: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
      },
      [`& .${props.datagrid}`]: {
        height: "100%",
      },
    }),
  }),
  { name: "Datagrid-fullscreen" },
);

export function useDatagridTheme() {
  const theme = useTheme();

  const datagridTheme = useMemo(
    (): Partial<Theme> => ({
      accentColor: theme.palette.secondary.main,
      accentLight: theme.palette.background.default,
      accentFg: "transparent",
      bgCell: theme.palette.background.paper,
      bgHeader: theme.palette.background.paper,
      bgHeaderHasFocus: theme.palette.background.paper,
      bgHeaderHovered: theme.palette.background.paper,
      bgBubbleSelected: theme.palette.background.paper,
      textHeader: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      fontFamily: themes.defaultLight.fontFamily.body,
      baseFontStyle: themes.defaultLight.fontSize.bodySmall,
      headerFontStyle: themes.defaultLight.fontSize.bodySmall,
      editorFontSize: themes.defaultLight.fontSize.bodySmall,
      textMedium: theme.palette.text.primary,
      textGroupHeader: theme.palette.text.secondary,
      textBubble: theme.palette.text.primary,
      textDark: theme.palette.text.primary,
      textLight: theme.palette.text.primary,
      cellHorizontalPadding: 8,
      cellVerticalPadding: 8,
      lineHeight: 20,
    }),
    [theme],
  );

  return datagridTheme;
}

export default useStyles;
