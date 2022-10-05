import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    card: {
      marginBottom: theme.spacing(3),
      "&:last-of-type": {
        marginBottom: 0,
      },
    },
  }),
  { name: "OrderTransaction" },
);
