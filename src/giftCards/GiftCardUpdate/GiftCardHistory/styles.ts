import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui/next";

const useStyles = makeStyles(
  theme => ({
    header: {
      fontWeight: 500,
      marginBottom: theme.spacing(1),
    },
    root: {
      marginTop: theme.spacing(4),
      paddingLeft: vars.space[9],
      paddingRight: vars.space[9],
    },
  }),
  { name: "GiftCardHistory" },
);

export default useStyles;
