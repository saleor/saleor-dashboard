import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  {
    root: {
      alignItems: "center",
      display: "flex",
      height: "100vh",
      justifyContent: "center",
    },
  },
  { name: "LoginLoading" },
);
const LoginLoading = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress size={128} />
    </div>
  );
};

LoginLoading.displayName = "LoginLoading";
export default LoginLoading;
