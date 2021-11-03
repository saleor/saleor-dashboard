import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    cancelButton: {
      marginRight: theme.spacing(2)
    },
    deleteButton: {
      "&:hover": {
        backgroundColor: theme.palette.error.dark
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText
    },
    spacer: {
      flex: "1"
    }
  }),
  { name: "styles" }
);

export default useStyles;
