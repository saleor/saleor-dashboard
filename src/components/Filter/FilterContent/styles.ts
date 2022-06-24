import { fade } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    andLabel: {
      margin: theme.spacing(0, 2),
    },
    arrow: {
      marginRight: theme.spacing(2),
    },
    filterSettings: {
      background: fade(theme.palette.primary.main, 0.1),
      padding: theme.spacing(2, 3),
    },
    inputRange: {
      alignItems: "center",
      display: "flex",
    },

    option: {
      left: theme.spacing(-0.5),
      position: "relative",
    },
    optionRadio: {
      left: theme.spacing(-0.25),
    },

    fieldInput: {
      padding: "12px 0 9px 12px",
    },
  }),
  { name: "Filter" },
);

export default useStyles;
