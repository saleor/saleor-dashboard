import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    header: {
      fontWeight: 500,
      marginBottom: theme.spacing(1),
    },
    root: { marginTop: theme.spacing(4) },
  }),
  { name: "GiftCardHistory" },
);

export default useStyles;
