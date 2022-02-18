import { makeStyles } from "@saleor/macaw-ui";
import { triangle } from "@saleor/styles/mixins";

const useStyles = makeStyles(
  theme => ({
    popper: {
      zIndex: 11
    },
    tooltip: {
      "&:before": {
        ...triangle(theme.palette.saleor.warning.mid, 8),
        content: "''",
        position: "absolute",
        left: 17,
        top: -8
      },
      background: theme.palette.saleor.warning.mid,
      borderRadius: 8,
      marginTop: theme.spacing(1.5),
      padding: theme.spacing(2.5),
      maxWidth: 400,
      position: "relative"
    }
  }),
  { name: "PreviewPill" }
);

export default useStyles;
