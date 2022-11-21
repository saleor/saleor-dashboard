import { makeStyles } from "@saleor/macaw-ui";

export const useSummaryLineStyles = makeStyles(
  theme => ({
    root: {
      display: "flex",
    },
    subText: {
      color: theme.palette.saleor.main[3],
      marginLeft: theme.spacing(1),
    },
    bold: {
      fontWeight: 600,
    },
    horizontal: {
      "&& dl": {
        display: "flex",
        width: "100%",
        gap: theme.spacing(2),
      },
      "&& dd": {
        marginLeft: "auto",
        display: "flex",
        alignItems: "baseline",
      },
    },
    moneySkeleton: {
      width: "6ch",
      alignSelf: "center",
    },
  }),
  { name: "SummaryLine" },
);
