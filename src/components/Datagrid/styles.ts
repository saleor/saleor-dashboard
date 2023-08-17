import { Theme } from "@glideapps/glide-data-grid";
import { makeStyles } from "@saleor/macaw-ui";
import { useTheme, vars } from "@saleor/macaw-ui/next";
import { useMemo } from "react";

export const cellHeight = 40;

const useStyles = makeStyles<{ actionButtonPosition?: "left" | "right" }>(
  () => {
    const rowActionSelected = {
      background: vars.colors.background.plain,
      color: vars.colors.border.neutralHighlight,
    };
    const activeBorderColor = vars.colors.border.neutralDefault;

    return {
      actionBtnBar: {
        position: "absolute",
        left: props => (props.actionButtonPosition === "left" ? 0 : "auto"),
        right: props => (props.actionButtonPosition === "right" ? 0 : "auto"),
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
        padding: vars.spacing[1.5],
      },
      columnPicker: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: cellHeight,
      },
      columnPickerBackground: {
        background: vars.colors.background.plain,
      },
      ghostIcon: {
        color: vars.colors.foreground.iconNeutralPlain,
        padding: vars.spacing[1],
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
          border: `1px solid ${vars.colors.border.brandSubdued}`,
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
        "& input:not([class*='MuiInputBase']), & textarea": {
          appearance: "none",
          background: "none",
          border: "none",
          fontSize: vars.fontSize.bodySmall,
          letterSpacing: vars.letterSpacing.bodyStrongSmall,
          lineHeight: vars.lineHeight.bodyEmpMedium,
          fontWeight: vars.fontWeight.bodySmall,
          padding: vars.spacing[1],
          outline: 0,
        },
        "& input[type='number']:not([class*='MuiInputBase'])": {
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
          overflowY: "hidden",
        },
        borderRadius: 0,
        boxSizing: "content-box",
        width: "100%",
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
        color: vars.colors.foreground.iconNeutralPlain,
        marginLeft: -1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: `calc(${cellHeight}px - 1px)`,
      },
      rowColumnGroup: {
        height: cellHeight,
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
        padding: "0",
        flex: 1,

        "&:last-child": {
          padding: "0",
        },
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

export function useDatagridTheme(
  readonly?: boolean,
  hasHeaderClickable?: boolean,
) {
  const { themeValues } = useTheme();

  const datagridTheme = useMemo(
    (): Partial<Theme> => ({
      accentColor: themeValues.colors.background.interactiveBrandDefault,
      accentLight:
        themeValues.colors.background.interactiveBrandSecondaryPressing,
      accentFg: "transparent",
      bgCell: themeValues.colors.background.plain,
      bgHeader: themeValues.colors.background.plain,
      bgHeaderHasFocus:
        themeValues.colors.background.interactiveNeutralSecondaryHovering,
      bgHeaderHovered: hasHeaderClickable
        ? themeValues.colors.background.interactiveNeutralSecondaryHovering
        : themeValues.colors.background.plain,
      bgBubbleSelected: themeValues.colors.background.plain,
      borderColor: themeValues.colors.border.neutralHighlight,
      fontFamily: "'Inter var', sans-serif",
      baseFontStyle: themeValues.fontSize.bodySmall,
      headerFontStyle: `${themeValues.fontWeight.bodyStrongSmall} ${themeValues.fontSize.bodyStrongSmall}`,
      editorFontSize: themeValues.fontSize.bodySmall,
      textMedium: themeValues.colors.foreground.iconNeutralPlain,
      textGroupHeader: themeValues.colors.foreground.iconNeutralDefault,
      textBubble: themeValues.colors.background.interactiveNeutralDefault,
      textDark: themeValues.colors.foreground.iconNeutralDefault,
      textLight: themeValues.colors.foreground.iconNeutralDefault,
      textHeader: themeValues.colors.foreground.iconNeutralDefault,
      textHeaderSelected: themeValues.colors.background.plain,
      cellHorizontalPadding: 8,
      cellVerticalPadding: 8,
      lineHeight: 20,
    }),
    [themeValues, hasHeaderClickable],
  );

  const readonylDatagridTheme = useMemo(
    () => ({
      ...datagridTheme,
      accentColor: themeValues.colors.background.decorativeSurfacePlain3,
      accentLight:
        themeValues.colors.background.interactiveNeutralSecondaryHovering,
    }),
    [themeValues, datagridTheme],
  );
  return readonly ? readonylDatagridTheme : datagridTheme;
}

export default useStyles;
