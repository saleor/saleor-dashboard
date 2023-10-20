import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";

export const useStyles = makeStyles(
  theme => ({
    header: {
      display: "flex",
      justifyContent: "space-between",
    },
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%",
      "& > div": {
        display: "flex",
        justifyContent: "flex-end",
      },
    },
    leftmostRightAlignedElement: {
      marginLeft: "auto",
    },
    rightmostLeftAlignedElement: {
      marginRight: "auto",
    },
    totalRow: {
      fontWeight: 600,
    },
    titleContainer: {
      display: "flex",
      alignItems: "center",
    },
    supportText: {
      color: theme.palette.saleor.main[3],
    },
    smallFont: {
      fontSize: theme.typography.body2.fontSize,
    },
    success: {
      color: theme.palette.success.dark,
    },
    actions: {
      gap: theme.spacing(1),
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "right",
    },
    payments: {
      paddingRight: vars.spacing[6],
    },
  }),
  { name: "OrderPayment" },
);
