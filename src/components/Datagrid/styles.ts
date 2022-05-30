import { makeStyles } from "@saleor/macaw-ui";

const cellHeight = 52;
const headerCellHeight = 52;
const actionBarWidth = 44;
export const rowIndicatorWidth = 44;
export const columnResizerWidth = 9;

const useStyles = makeStyles(
  theme => ({
    actions: {
      background: theme.palette.saleor.background.default,
      position: "absolute",
      tableLayout: "fixed",
      borderCollapse: "collapse",
      width: actionBarWidth + 1,
      right: 0,
      top: 0
    },
    actionRow: {
      "&:first-child th": {
        height: headerCellHeight
      },
      "& td": {
        border: `1px solid ${theme.palette.saleor.main[5]}`,
        borderRight: "none",
        height: cellHeight
      }
    },
    actionCol: {
      width: actionBarWidth
    },
    columnResize: {
      cursor: "e-resize",
      width: columnResizerWidth,
      height: "100%",
      position: "absolute",
      top: 0
    },
    cornerIndicator: {
      height: headerCellHeight
    },
    rowIndicator: {
      border: "1px solid var(--border-color)",
      borderLeft: "none"
    },
    rowIndicatorCol: {
      width: rowIndicatorWidth
    },
    scrollable: {
      overflowX: "scroll",
      position: "relative"
    },
    wrapper: {
      position: "relative"
    },
    table: {
      borderCollapse: "collapse",
      border: "none",
      tableLayout: "fixed",
      width: "100%"
    },
    spreadsheet: {
      "& th": {
        fontWeight: 400,
        height: headerCellHeight,
        textAlign: "left",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      },
      "& .Spreadsheet__cell": {
        height: cellHeight
      },
      "& .Spreadsheet__active-cell": {
        "& input": {
          letterSpacing: "inherit"
        },
        fontWeight: 500
      },
      "& .Spreadsheet__active-cell, .Spreadsheet__floating-rect--selected": {
        borderWidth: 1
      },
      "--background-color": theme.palette.saleor.background.default,
      "--text-color": "inherit",
      "--border-color": theme.palette.saleor.main[5],
      "--outline-background-color": "rgba(0,0,0,.05)",
      "--outline-color": theme.palette.saleor.main[1],
      "--elevation": "none",
      display: "block",
      fontWeight: 500,
      width: "100%"
    }
  }),
  { name: "Datagrid" }
);

export default useStyles;
