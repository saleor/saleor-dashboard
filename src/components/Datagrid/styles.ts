import { Theme } from "@glideapps/glide-data-grid";
import { makeStyles, useTheme } from "@saleor/macaw-ui";
import { useMemo } from "react";

const useStyles = makeStyles(
  theme => {
    const rowActionSelected = {
      background: theme.palette.background.paper,
      color: theme.palette.saleor.main[1],
    };

    return {
      actionBtnBar: {
        position: "absolute",
        zIndex: 1,
        background: theme.palette.background.default,
        // Right and left toolbars
        width: "calc(100% - 64px - 35px)",
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
          background: theme.palette.background.default,
          border: "none",
          boxShadow: "none",
          padding: 0,
        },
        "& input, & textarea": {
          ...theme.typography.body1,
          appearance: "none",
          background: "none",
          border: "none",
          fontSize: theme.typography.body2.fontSize,
          fontWeight: 700,
          letterSpacing: "0.6px",
          padding: `1.3rem ${theme.spacing(1)}`,
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
        border: `1px solid ${theme.palette.divider}`,
        boxSizing: "content-box",
      },
      root: {
        position: "relative",
      },
      rowActionBar: {
        height: "100%",
        background: theme.palette.background.default,
        borderLeft: `1px solid ${theme.palette.divider}`,
        width: 48,
      },
      rowAction: {
        "&:hover, $rowActionSelected": {
          rowActionSelected,
        },
        "&:not(:last-child)": {
          marginBottom: -1,
        },
        border: `1px solid ${theme.palette.divider}`,
        borderRight: "none",
        cursor: "pointer",
        color: theme.palette.saleor.main[5],
        marginLeft: -1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 47,
      },
      rowActionSelected,
    };
  },
  { name: "Datagrid" },
);

export function useDatagridTheme() {
  const theme = useTheme();
  const datagridTheme = useMemo(
    (): Partial<Theme> => ({
      accentColor: theme.palette.saleor.main[1],
      accentLight: theme.palette.background.paper,
      accentFg: theme.palette.divider,
      bgCell: theme.palette.background.default,
      bgHeader: theme.palette.background.default,
      bgHeaderHasFocus: theme.palette.background.default,
      bgHeaderHovered: theme.palette.background.default,
      bgBubbleSelected: theme.palette.background.paper,
      textHeader: theme.palette.saleor.main[3],
      borderColor: theme.palette.divider,
      fontFamily: theme.typography.fontFamily,
      baseFontStyle: `bold ${theme.typography.body2.fontSize}`,
      headerFontStyle: theme.typography.caption.fontSize as string,
      editorFontSize: `bold ${theme.typography.body2.fontSize}`,
    }),
    [theme],
  );

  return datagridTheme;
}

export default useStyles;
