import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    arrow: {
      transform: "rotate(180deg)",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      width: "100%",
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
    passwordWrapper: {
      position: "relative",
      width: "100%",
    },
    showPasswordBtn: {
      position: "absolute",
      top: 6,
      right: 8,
    },
  }),
  { name: "Login" },
);

export default useStyles;
