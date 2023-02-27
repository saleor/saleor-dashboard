import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    arrow: {
      transform: "rotate(180deg)",
    },
    backBtn: {
      marginBottom: theme.spacing(3),
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
    },
    header: {
      fontWeight: 700,
      marginBottom: theme.spacing(2),
    },
    link: {
      color: theme.palette.primary.main,
      cursor: "pointer",
      display: "block",
      margin: theme.spacing(2, 0),
      textDecoration: "underline",
      textAlign: "right",
    },
    loading: {
      alignItems: "center",
      display: "flex",
      minHeight: "80vh",
      justifyContent: "center",
    },
    loginButton: {
      width: "100%",
    },
    panel: {
      "& span": {
        color: theme.palette.error.contrastText,
      },
      ...theme.typography.body1,
      background: theme.palette.alert.paper.error,
      borderRadius: 8,
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2.5),
    },
    passwordWrapper: {
      position: "relative",
    },
    showPasswordBtn: {
      position: "absolute",
      top: 6,
      right: 8,
    },
    submit: {
      width: "100%",
    },
  }),
  { name: "Login" },
);

export default useStyles;
