import { makeStyles } from "@saleor/macaw-ui";

export const useActionsStyles = makeStyles(
  theme => ({
    cardActionsText: {
      width: "100%",
    },
    cardActionsIssueText: {
      width: "100%",
      color: theme.palette.error.main,
      whiteSpace: "nowrap",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: theme.spacing(1),
    },
    releaseDate: {
      color: theme.palette.saleor.main[3],
    },
  }),
  { name: "AppListCardActions" },
);
