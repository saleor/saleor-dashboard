import { Theme } from "@glideapps/glide-data-grid";
import { makeStyles } from "@saleor/macaw-ui";
import { useTheme, vars } from "@saleor/macaw-ui-next";
import { useMemo } from "react";

export const cellHeight = 40;

const useStyles = makeStyles<{ actionButtonPosition?: "left" | "right" }>(
  () => {
    const rowActionSelected = {
      background: vars.colors.background.default1,
      color: vars.colors.border.default1,
    };
    const activeBorderColor = vars.colors.border.default1;

    return {
      actionBtnBar: {
        position: "absolute",
        left: props => (props.actionButtonPosition === "left" ? 0 : "auto"),
        right: props => (props.actionButtonPosition === "right" ? 0 : "auto"),
        zIndex: 1,
        background: vars.colors.background.default1,
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
        background: vars.colors.background.default1,
      },
      ghostIcon: {
        color: vars.colors.text.default1,
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
          border: `1px solid ${vars.colors.border.accent1}`,
        },
        "& .gdg-growing-entry": {
          flex: 1,
          marginTop: 0,
        },
        "& .gdg-style": {
          background: vars.colors.background.default1,
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
        paddingBottom: "1px",
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
        background: vars.colors.background.default1,
      },
      rowActionBarScrolledToRight: {
        borderLeftColor: vars.colors.border.default1,
      },
      rowAction: {
        "&:hover, $rowActionSelected": {
          rowActionSelected,
        },
        "&:not(:last-child)": {
          marginBottom: -1,
        },
        border: `1px solid ${vars.colors.border.default1}`,
        borderLeft: "none",
        borderRight: "none",
        color: vars.colors.text.default1,
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
        borderLeftColor: vars.colors.border.default1,
      },
      columnGroupFixer: {
        position: "absolute",
        top: 1,
        left: 0,
        height: cellHeight,
        width: 10,
        borderLeft: 0,
        background: vars.colors.background.default1,
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
        "& .dvn-scroller": {
          overflowY: "scroll",
        },
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
      accentColor: themeValues.colors.background.accent1,
      accentLight: themeValues.colors.background.accent1Hovered,
      accentFg: "transparent",
      bgCell: themeValues.colors.background.default1,
      bgHeader: themeValues.colors.background.default1,
      bgHeaderHasFocus: themeValues.colors.background.default1Hovered,
      bgHeaderHovered: hasHeaderClickable
        ? themeValues.colors.background.default1Hovered
        : themeValues.colors.background.default1,
      bgBubbleSelected: themeValues.colors.background.default1,
      borderColor: themeValues.colors.border.default1,
      fontFamily: "'Inter var', sans-serif",
      baseFontStyle: `${themeValues.fontWeight.bodyEmpMedium} ${themeValues.fontSize.bodySmall}`,
      headerFontStyle: `${themeValues.fontWeight.bodyStrongSmall} ${themeValues.fontSize.bodyStrongSmall}`,
      editorFontSize: themeValues.fontSize.bodySmall,
      textMedium: themeValues.colors.text.default1,
      textGroupHeader: themeValues.colors.text.default1,
      textBubble: themeValues.colors.background.default1,
      textDark: themeValues.colors.text.default1,
      textLight: themeValues.colors.text.default2,
      textHeader: themeValues.colors.text.default1,
      textHeaderSelected: themeValues.colors.background.default1,
      cellHorizontalPadding: 8,
      cellVerticalPadding: 8,
      lineHeight: 20,
    }),
    [themeValues, hasHeaderClickable],
  );

  const readonylDatagridTheme = useMemo(
    () => ({
      ...datagridTheme,
      accentColor: themeValues.colors.background.accent1,
      accentLight: themeValues.colors.background.default1Hovered,
    }),
    [themeValues, datagridTheme],
  );
  return readonly ? readonylDatagridTheme : datagridTheme;
}

export default useStyles;
