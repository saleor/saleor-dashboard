import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    /**
     * Spinboxes are up & down arrows that are used to change the value of a number
     * in html input elements with type=number. There is a different styling for
     * hiding them, dependent on browser (as of mid-2022).
     */
    hideSpinboxes: {
      // chrome, safari
      "& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
        appearance: "none",
        margin: 0,
      },
      // firefox
      "& input": {
        "-moz-appearance": "textfield",
      },
    },
    inputPadding: {
      padding: "16px 0 16px 0",
    },
  }),
  { name: "TaxInput" },
);
