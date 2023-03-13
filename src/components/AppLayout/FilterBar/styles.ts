import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui/next";

export const useStyles = makeStyles(
  () => ({
    popover: {
      backgroundColor: vars.colors.background.surfaceNeutralPlain,
      overflowY: "scroll",
      boxShadow: `0px 6px 11px 9px ${vars.colors.background.surfaceNeutralHighlight}`,
      height: 450,
      width: 376,
      zIndex: 5,
    },
  }),
  { name: "Filter" },
);
