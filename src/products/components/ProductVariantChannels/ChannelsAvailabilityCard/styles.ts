import { makeStyles } from "@saleor/macaw-ui";

export const useAccordionStyles = makeStyles(
  () => ({
    summaryContent: {
      paddingTop: 0,
    },
  }),
  { name: "VariantDetailsChannelsAvailabilityCard" },
);

export const useExpanderStyles = makeStyles(
  () => ({
    expanded: {},
    root: {
      boxShadow: "none",
      margin: 0,
      padding: 0,

      "&:before": {
        content: "none",
      },

      "&$expanded": {
        margin: 0,
        border: "none",
      },
    },
  }),
  { name: "VariantDetailsChannelsAvailabilityCardExpander" },
);

export const useSummaryStyles = makeStyles(
  () => ({
    expanded: {},
    root: {
      width: "100%",
      border: "none",
      margin: 0,
      padding: 0,
      minHeight: 0,

      "&$expanded": {
        minHeight: 0,
      },
    },
    content: {
      margin: 0,

      "&$expanded": {
        margin: 0,
      },
    },
  }),
  { name: "VariantDetailsChannelsAvailabilityCardExpanderSummary" },
);
