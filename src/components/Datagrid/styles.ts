import { Theme } from "@glideapps/glide-data-grid";
import { makeStyles, useTheme } from "@saleor/macaw-ui";
import { useMemo } from "react";

const useStyles = makeStyles(
  theme => {
    const rowActionSelected = {
      background: theme.palette.divider,
      color: theme.palette.saleor.main[1],
    };

    return {
      actionBtnBar: {
        position: "absolute",
        zIndex: 1,
        background: theme.palette.background.default,
        // Right and left toolbars
        width: "calc(100% - 48px - 33px)",
        marginLeft: 33,
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
      portal: { position: "fixed", top: 0, left: 0 },
      datagrid: {
        // borderTop: `1px solid ${theme.palette.divider}`,
        // borderBottom: `1px solid ${theme.palette.divider}`,
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
        height: 49,
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
      accentLight: theme.palette.divider,
      accentFg: theme.palette.divider,
      bgCell: theme.palette.background.default,
      bgHeader: theme.palette.background.default,
      bgHeaderHasFocus: theme.palette.background.default,
      bgHeaderHovered: theme.palette.background.default,
      bgBubbleSelected: theme.palette.background.default,
      textHeader: theme.palette.saleor.main[3],
      borderColor: theme.palette.divider,
      fontFamily: theme.typography.fontFamily,
      baseFontStyle: theme.typography.body1.fontSize as string,
      headerFontStyle: theme.typography.body2.fontSize as string,
      editorFontSize: theme.typography.body1.fontSize as string,
    }),
    [theme],
  );

  return datagridTheme;
}

export default useStyles;
