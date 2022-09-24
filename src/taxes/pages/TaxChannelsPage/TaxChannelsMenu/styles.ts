import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    clickable: {
      cursor: "pointer"
    },
    ellipsis: {
      textOverflow: "ellipsis",
      overflow: "hidden"
    },
    selected: {
      "&&&&::before": {
        position: "absolute",
        left: 0,
        width: "4px",
        height: "100%",
        backgroundColor: theme.palette.saleor.active[1]
      }
    }
  }),
  { name: "TaxChannelsMenu" }
);
