import { fade } from "@material-ui/core/styles/colorManipulator";
import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    colAvatar: {
      width: 64,
    },
    colName: {
      paddingLeft: 0,
    },
    defaultVariant: {
      color: fade(theme.palette.text.secondary, 0.6),
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
  }),
  { name: "ProductVariantNavigation" },
);
