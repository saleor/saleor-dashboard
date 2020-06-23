import errorIcon from "@assets/images/error-icon.svg";
import infoIcon from "@assets/images/info-icon.svg";
import successIcon from "@assets/images/success-icon.svg";
import warningIcon from "@assets/images/warning-icon.svg";
import { makeStyles } from "@material-ui/core/styles";
import { darken } from "@material-ui/core/styles/colorManipulator";

const successColor = "#60DAA0";
const warningColor = "#FFB84E";
const infoColor = "#CAD8DF";

export const useStyles = makeStyles(
  theme => ({
    "@keyframes bar": {
      from: { transform: "translateX(-100%)" },
      to: { transform: "translateX(0)" }
    },
    closeBtn: {
      position: "absolute",
      right: 0,
      top: 0
    },
    error: {
      "& > div": {
        "& button span": {
          color: "#fff"
        },
        "&:before": {
          backgroundImage: `url(${errorIcon})`
        },

        backgroundColor: theme.palette.error.main,
        color: "#fff"
      }
    },
    progressBar: {
      backgroundColor: infoColor,
      height: 8,
      transform: "translateX(-100%)",
      width: "100%"
    },
    progressBarActive: {
      animation: `$bar var(--animationTime) ease both`
    },
    progressBarContainer: {
      borderRadius: "0 0 4px 4px",
      bottom: 0,
      left: 0,
      overflow: "hidden",
      position: "absolute",
      width: "calc(100%)"
    },
    progressBarError: {
      backgroundColor: darken(theme.palette.error.main, 0.2)
    },
    progressBarSuccess: {
      backgroundColor: darken(successColor, 0.2)
    },
    progressBarWarning: {
      backgroundColor: darken(warningColor, 0.2)
    },
    snackbar: {
      "& > div": {
        "&:before": {
          backgroundImage: `url(${infoIcon})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          content: "''",
          display: "block",
          height: 32,
          left: 15,
          position: "absolute",
          top: 13,
          width: 32
        },
        paddingLeft: 60,
        position: "relative"
      }
    },
    success: {
      "& > div": {
        "& button span": {
          color: "#fff"
        },
        "&:before": {
          backgroundImage: `url(${successIcon})`
        },

        backgroundColor: successColor,
        color: "#fff"
      }
    },
    text: {
      color: "#fff",
      paddingTop: 5
    },
    textInfo: {
      paddingTop: 5
    },
    warning: {
      "& > div": {
        "& button span": {
          color: "#fff"
        },
        "&:before": {
          backgroundImage: `url(${warningIcon})`
        },
        backgroundColor: warningColor,
        color: "#fff"
      }
    }
  }),
  { name: "MessageManager" }
);
