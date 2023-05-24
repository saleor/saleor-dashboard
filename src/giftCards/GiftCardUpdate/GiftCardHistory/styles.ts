import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui/next";

const useStyles = makeStyles(
  {
    header: {
      fontWeight: 500,
      marginBottom: vars.space.spx,
    },
    root: {
      marginTop: vars.space["s1.5"],
      paddingLeft: vars.space.s6,
      paddingRight: vars.space.s6,
    },
  },
  { name: "GiftCardHistory" },
);

export default useStyles;
