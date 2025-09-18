import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

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
/**
 * LoginLoading 组件，用于在页面中央显示一个加载指示器。
 *
 * 此组件通常用于指示应用程序正在处理用户登录过程。
 *
 * @param {object} props - LoginLoading 组件的属性（在这种情况下为空）。
 * @returns {React.ReactElement} 一个显示居中加载指示器的 React 元素。
 */
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
