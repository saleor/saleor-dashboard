import { pageViewportHeight } from "@dashboard/components/AppLayout/consts";
import { SaleorThrobber } from "@dashboard/components/Throbber/SaleorThrobber";
import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  {
    root: {
      alignItems: "center",
      display: "flex",
      // Also the loading state of a page below the connection banner.
      height: pageViewportHeight,
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
