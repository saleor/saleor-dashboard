import { Theme } from "@glideapps/glide-data-grid";
import { makeStyles } from "@saleor/macaw-ui";
import { themes, useTheme, vars } from "@saleor/macaw-ui/next";
import { useMemo } from "react";

export const cellHeight = 36;

const useStyles = makeStyles(
  () => {
    const rowActionSelected = {
      background: vars.colors.background.plain,
      color: vars.colors.border.neutralHighlight,
    };
    const activeBorderColor = vars.colors.border.neutralDefault;

    return {
      actionBtnBar: {
        position: "absolute",
        zIndex: 1,
        background: vars.colors.background.plain,
        borderRadius: vars.borderRadius[4],
        // Right and left toolbars
        width: `calc(100% - 64px - ${cellHeight} - 1px)`,
        marginTop: 1,
        marginLeft: 50,
        height: cellHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: vars.space[4],
      },
      columnPicker: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: cellHeight + 16,
      },
      columnPickerBackground: {
        background: vars.colors.background.plain,
      },
      ghostIcon: {
        color: vars.colors.foreground.iconNeutralPlain,
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
          border: `1px solid ${vars.colors.border.neutralHighlight}`,
        },
        "& .gdg-growing-entry": {
          flex: 1,
          marginTop: 0,
        },
        "& .gdg-style": {
          background: vars.colors.background.plain,
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
          fontSize: vars.fontSize.bodySmall,
          letterSpacing: vars.letterSpacing.bodyStrongSmall,
          lineHeight: vars.lineHeight.bodyEmpSmall,
          fontWeight: vars.fontWeight.bodySmall,
          padding: vars.space[3],
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
        borderTop: `1px solid ${vars.colors.border.neutralHighlight}`,
        borderBottom: `1px solid ${vars.colors.border.neutralHighlight}`,
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
        width: 36,
      },
      rowActionvBarWithItems: {
        borderLeft: `1px solid ${activeBorderColor}`,
        background: vars.colors.background.plain,
      },
      rowActionBarScrolledToRight: {
        borderLeftColor: vars.colors.border.neutralHighlight,
      },
      rowAction: {
        "&:hover, $rowActionSelected": {
          rowActionSelected,
        },
        "&:not(:last-child)": {
          marginBottom: -1,
        },
        border: `1px solid ${vars.colors.border.neutralHighlight}`,
        borderLeft: "none",
        borderRight: "none",
        cursor: "pointer",
        color: vars.colors.foreground.iconNeutralPlain,
        marginLeft: -1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: `calc(${cellHeight}px - 1px)`,
      },
      rowColumnGroup: {
        height: cellHeight + 15,
      },
      rowActionScrolledToRight: {
        borderLeftColor: vars.colors.border.neutralHighlight,
      },
      columnGroupFixer: {
        position: "absolute",
        top: 1,
        left: 0,
        height: cellHeight,
        width: 10,
        borderLeft: 0,
        background: vars.colors.background.plain,
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
        transition: "box-shadow .2s ease-in-out",
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

export function useDatagridTheme(readonly?: boolean) {
  const { theme: selectedTheme } = useTheme();
  const theme = themes[selectedTheme];

  const datagridTheme = useMemo(
    (): Partial<Theme> => ({
      accentColor: theme.colors.background.surfaceBrandDepressed,
      accentLight: theme.colors.background.interactiveBrandSecondaryHovering,
      accentFg: "transparent",
      bgCell: theme.colors.background.plain,
      bgHeader: theme.colors.background.plain,
      bgHeaderHasFocus: theme.colors.background.plain,
      bgHeaderHovered: theme.colors.background.surfaceNeutralHighlight,
      bgBubbleSelected: theme.colors.background.plain,
      textHeader: theme.colors.foreground.iconNeutralPlain,
      borderColor: theme.colors.border.neutralHighlight,
      fontFamily: theme.fontFamily.body,
      baseFontStyle: theme.fontSize.bodySmall,
      headerFontStyle: theme.fontSize.captionSmall,
      editorFontSize: theme.fontSize.bodySmall,
      textMedium: theme.colors.background.interactiveNeutralDefault,
      textGroupHeader: theme.colors.foreground.iconNeutralPlain,
      textBubble: theme.colors.background.interactiveNeutralDefault,
      textDark: theme.colors.background.interactiveNeutralDefault,
      textLight: theme.colors.background.interactiveNeutralDefault,
      textHeaderSelected: theme.colors.foreground.textBrandSubdued,
      cellHorizontalPadding: 8,
      cellVerticalPadding: 8,
      lineHeight: 20,
    }),
    [theme],
  );

  const readonylDatagridTheme = useMemo(
    () => ({
      ...datagridTheme,
      accentLight: theme.colors.background.plain,
    }),
    [theme, datagridTheme],
  );
  return readonly ? readonylDatagridTheme : datagridTheme;
}

export default useStyles;
