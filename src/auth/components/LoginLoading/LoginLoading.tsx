import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(
  {
    root: {
      alignItems: "center",
      display: "flex",
      height: "100vh",
      justifyContent: "center"
    }
  },
  { name: "LoginLoading" }
);
const LoginLoading: React.FC = props => {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <CircularProgress size={128} />
    </div>
  );
};
LoginLoading.displayName = "LoginLoading";
export default LoginLoading;
