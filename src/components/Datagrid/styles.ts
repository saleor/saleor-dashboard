import { Theme } from "@glideapps/glide-data-grid";
import { makeStyles, useTheme } from "@saleor/macaw-ui";
import { useMemo } from "react";

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
        width: "calc(100% - 64px - 48px - 1px)",
        marginTop: 1,
        marginLeft: 50,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(1),
      },
      btnContainer: {
        display: "flex",
        flexDirection: "row-reverse",
      },
      addBtn: {
        marginBottom: theme.spacing(2),
      },
      columnPicker: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 48,
      },
      columnPickerBtn: {
        "&:hover": {
          color: theme.palette.saleor.main[1],
        },
      },
      portal: {
        "& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
          appearance: "none",
          margin: 0,
        },
        "& input[type=number]": {
          appearance: "textfield",
        },
        "& .clip-region": {
          border: `1px solid ${theme.palette.saleor.main[1]}`,
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
          ...theme.typography.body1,
          appearance: "none",
          background: "none",
          border: "none",
          fontSize: theme.typography.body1.fontSize,
          letterSpacing: "0.44px",
          padding: `1.4rem ${theme.spacing(1)}`,
          outline: 0,
        },
        '& input[type="number"]': {
          textAlign: "right",
          width: "100%",
        },
        position: "fixed",
        top: 0,
        left: 0,
      },
      datagrid: {
        "& .dvn-scroller": {
          overscrollBehaviorX: "none",
        },
        borderTop: `1px solid ${theme.palette.divider}`,
        borderRadius: "0 0 8px 8px",
        boxSizing: "content-box",
      },
      root: {
        position: "relative",
      },
      rowActionBar: {
        height: "100%",
        background: theme.palette.background.paper,
        borderLeft: `1px solid ${activeBorderColor}`,
        width: 48,
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
        height: 47,
      },
      rowActionScrolledToRight: {
        borderLeftColor: theme.palette.divider,
      },
      columnGroupFixer: {
        position: "absolute",
        top: 5,
        left: 1,
        height: 44,
        width: 2,
        background: theme.palette.background.paper,
      },
      editorContainer: {
        position: "relative",
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
        padding: 0,
      },
    };
  },
  { name: "Datagrid" },
);

export function useDatagridTheme() {
  const theme = useTheme();
  const datagridTheme = useMemo(
    (): Partial<Theme> => ({
      accentColor: theme.palette.primary.main,
      accentLight: theme.palette.background.default,
      accentFg: "transparent",
      bgCell: theme.palette.background.paper,
      bgHeader: theme.palette.background.paper,
      bgHeaderHasFocus: theme.palette.background.paper,
      bgHeaderHovered: theme.palette.background.paper,
      bgBubbleSelected: theme.palette.background.paper,
      textHeader: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      fontFamily: theme.typography.fontFamily,
      baseFontStyle: theme.typography.body1.fontSize as string,
      headerFontStyle: theme.typography.body2.fontSize as string,
      editorFontSize: theme.typography.body1.fontSize as string,
      textMedium: theme.palette.text.primary,
      textGroupHeader: theme.palette.text.secondary,
      textBubble: theme.palette.text.primary,
      textDark: theme.palette.text.primary,
      textLight: theme.palette.text.primary,
    }),
    [theme],
  );

  return datagridTheme;
}

export default useStyles;
