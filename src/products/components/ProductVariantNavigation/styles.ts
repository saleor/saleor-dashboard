import { alpha } from "@material-ui/core/styles";
import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui/next";

export const useStyles = makeStyles(
  theme => ({
    colAvatar: {
      width: 64,
      paddingRight: 0,
    },
    colName: {
      paddingLeft: 0,
    },
    defaultVariant: {
      color: alpha(theme.palette.text.secondary, 0.6),
      display: "block",
    },
    firstVariant: {
      width: 104,
    },
    link: {
      cursor: "pointer",
    },
    noHandle: {
      "&&&": {
        paddingRight: theme.spacing(3),
      },
      textAlign: "right",
    },
    rowActive: {
      borderLeft: `${theme.palette.primary.main} solid 2px`,
    },
    rowNew: {
      "&:hover": {
        backgroundColor: "unset !important",
      },
    },
    rowNewCell: {
      border: "none",
      paddingLeft: `${vars.spacing[5]} !important`,
    },
    newAvatart: {
      paddingRight: vars.spacing[3],
    },
  }),
  { name: "ProductVariantNavigation" },
);
