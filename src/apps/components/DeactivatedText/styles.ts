import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(
  theme => ({
    root: {
      "&:before": {
        backgroundColor: theme.palette.error.main,
        borderRadius: "50%",
        content: "''",
        display: "block",
        height: 8,
        left: 0,
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 8
      },
      color: theme.palette.error.main,
      display: "inline-block",
      marginLeft: theme.spacing(1.5),
      paddingLeft: theme.spacing(2),
      position: "relative"
    }
  }),
  { name: "DeactivatedText" }
);
