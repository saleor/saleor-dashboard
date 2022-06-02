import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    hideSpinboxes: {
      // chrome, safari
      "& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
        appearance: "none",
        margin: 0
      },
      // firefox
      "& input": {
        "-moz-appearance": "textfield"
      }
    },
    inputPadding: {
      padding: "16px 0 16px 0"
    }
  }),
  { name: "TaxInput" }
);
