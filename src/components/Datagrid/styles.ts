import { makeStyles } from "@saleor/macaw-ui";

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
      root: {
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
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

export default useStyles;
