import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    preview: {
      marginLeft: theme.spacing(1),
    },
  }),
  { name: "ProductVariantCheckoutSettings" },
);

export default useStyles;
