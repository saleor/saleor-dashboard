import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    buttonContainer: {
      marginTop: theme.spacing(2),
    },
    container: {
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr",
        padding: theme.spacing(3),
        width: "100%",
      },
      display: "grid",
      gridTemplateColumns: "1fr 487px",
      margin: "0 auto",
      gap: theme.spacing(5),
      width: `calc(480px * 2 + ${theme.spacing(5)})`,
    },
    conjunction: {
      display: "inline-block",
      margin: theme.spacing(0, 1),
    },
    errorId: {
      marginTop: theme.spacing(3),
      letterSpacing: "0.1rem",
      textTransform: "uppercase",
      fontWeight: 500,
    },
    innerContainer: {
      [theme.breakpoints.down("sm")]: {
        order: 1,
        textAlign: "center",
      },
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    notFoundImage: {
      width: "100%",
    },
    root: {
      alignItems: "center",
      display: "flex",
      height: "calc(100vh - 180px)",
    },
    header: {
      marginBottom: theme.spacing(2),
    },
  }),
  { name: "ErrorPage" },
);

export default useStyles;
