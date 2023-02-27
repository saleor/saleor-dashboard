import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  {
    ellipsis: {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
  },
  { name: "SaleSummary" },
);

export default useStyles;
