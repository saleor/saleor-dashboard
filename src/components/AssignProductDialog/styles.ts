import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  {
    avatar: {
      width: 72,
    },
    wideCell: {
      width: "100%",
    },
    selectAllRow: {
      paddingInline: "var(--modal-padding)",
      paddingBlock: "var(--mu-spacing-2)",
      borderBottom: "1px solid var(--mu-colors-border-default1)",
    },
  },
  { name: "AssignProductDialog" },
);
