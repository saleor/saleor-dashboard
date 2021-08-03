import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    container: {
      width: 400
    },
    innerContainer: {
      width: "100%"
    },
    textField: {
      width: "100%",
      paddingRight: 0,
      "& input": {
        maxWidth: "100%"
      }
    },
    textFieldCentered: {
      "& input": {
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
