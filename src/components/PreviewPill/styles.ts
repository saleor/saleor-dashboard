import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    popper: {
      zIndex: 1302,
    },
    tooltip: {
      // TO-FIX
      // Triangle's position is hard coded
      // "&:before": {
      //   ...triangle(theme.palette.saleor.warning.mid, 8),
      //   content: "''",
      //   position: "absolute",
      //   left: 17,
      //   top: -8
      // },
      background: theme.palette.saleor.warning.mid,
      borderRadius: 8,
      marginTop: theme.spacing(1.5),
      padding: theme.spacing(2.5),
      maxWidth: 400,
      position: "relative",
    },
    tooltipText: {
      color: theme.palette.common.black,
    },
  }),
  { name: "PreviewPill" },
);

export default useStyles;
