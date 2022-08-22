import { makeStyles } from "@saleor/macaw-ui";

export const useTableStyles = makeStyles(
  theme => ({
    cardCodeContainer: {
      display: "flex",
      alignItems: "baseline",
    },
    colCardCode: {
      paddingLeft: 0,
      width: 400,
    },
    colDelete: {
      width: 88,
    },
    colBalance: {
      width: 135,
    },
    colProduct: {
      width: 250,
    },
    colBase: {
      width: 150,
    },
    pill: {
      display: "block",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: "min-content",
      overflow: "hidden",
    },
    row: {
      cursor: "pointer",
      height: 70,
      "& td, & th": {
        height: "auto",
      },
    },
    skeleton: {
      paddingLeft: 0,
    },
    toolbar: {
      display: "flex",
      gap: theme.spacing(),
      marginRight: theme.spacing(-0.5),
    },
  }),
  { name: "GiftCardsListTable" },
);

export const useHeaderStyles = makeStyles(
  theme => ({
    alertLink: {
      fontSize: theme.typography.body2.fontSize,
    },
  }),
  { name: "GiftCardsListHeader" },
);
