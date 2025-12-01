import { SaleorThrobber } from "@dashboard/components/Throbber";
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
const LoginLoading = (props: {}) => {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <SaleorThrobber size={64} />
    </div>
  );
};

LoginLoading.displayName = "LoginLoading";
export default LoginLoading;
