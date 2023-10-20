// @ts-strict-ignore
import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";

const useStyles = makeStyles(
  {
    header: {
      fontWeight: 500,
      marginBottom: vars.spacing.px,
    },
    root: {
      marginTop: vars.spacing[1.5],
      paddingLeft: vars.spacing[6],
      paddingRight: vars.spacing[6],
    },
  },
  { name: "GiftCardHistory" },
);

export default useStyles;
