import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    container: {
      position: "relative",
      width: 400
    },
    innerContainer: {
      width: "100%"
    },
    textField: {
      width: "100%",
      "& input": {
        width: "70%",
        paddingTop: 16,
        paddingBottom: 16
      }
    },
    autocompleteField: {
      height: 52,
      border: "none",
      "& *": {
        border: "none"
      },
      "& *:focus": {
        background: "none"
      }
    }
  }),
  { name: "TextWithSelectField" }
);
