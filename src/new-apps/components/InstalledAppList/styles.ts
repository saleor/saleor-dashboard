import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    table: {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  }),
  { name: "InstalledAppList" },
);
