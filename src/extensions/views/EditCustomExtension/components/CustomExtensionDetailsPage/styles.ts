import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    activateButton: {
      "& img": {
        marginRight: theme.spacing(1),
      },
    },
  }),
  { name: "CustomAppDetailsPage" },
);
