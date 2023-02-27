import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  () => ({
    noOverflow: {
      "&&": {
        overflow: "visible",
      },
    },
  }),
  { name: "StaffDetailsPage" },
);

export default useStyles;
