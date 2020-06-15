import errorIcon from "@assets/images/error-icon.svg";
import successIcon from "@assets/images/success-icon.svg";
import { createStyles, Theme } from "@material-ui/core/styles";

export const styles = (theme: Theme) =>
  createStyles({
    error: {
      "& > div": {
        "&:before": {
          backgroundImage: `url(${errorIcon})`
        },
        backgroundColor: theme.palette.error.main
      }
    },
    snackbar: {
      "& > div": {
        "&:before": {
          backgroundRepeat: "no-repet",
          backgroundSize: "contain",
          content: "''",
          display: "block",
          height: 32,
          left: 10,
          position: "absolute",
          width: 32
        },
        color: "#fff",
        paddingLeft: 53,
        position: "relative"
      }
    },
    success: {
      "& > div": {
        "&:before": {
          backgroundImage: `url(${successIcon})`
        },
        backgroundColor: "#60DAA0"
      }
    }
  });
