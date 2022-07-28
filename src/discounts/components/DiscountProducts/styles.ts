import { AVATAR_MARGIN } from "@saleor/components/TableCellAvatar/Avatar";
import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    colActions: {
      width: `calc(76px + ${theme.spacing(1)})`,
    },
    colName: {
      paddingLeft: 0,
      width: "auto",
      minWidth: 200,
    },
    colNameLabel: {
      marginLeft: `calc(${AVATAR_MARGIN}px + ${theme.spacing(3)})`,
    },
    colPublished: {
      width: "auto",
      minWidth: 150,
    },
    colType: {
      width: "auto",
      minWidth: 150,
    },
    table: {
      tableLayout: "fixed",
    },
    tableRow: {
      cursor: "pointer",
    },
  }),
  { name: "DiscountProducts" },
);
