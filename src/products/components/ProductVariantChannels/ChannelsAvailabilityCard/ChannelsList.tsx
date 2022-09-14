import {
  Accordion,
  AccordionSummary,
  CardContent,
  Typography,
} from "@material-ui/core";
import IconChevronDown from "@saleor/icons/ChevronDown";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useExpanderStyles = makeStyles(
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

const useSummaryStyles = makeStyles(
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

const useStyles = makeStyles(
  () => ({
    summaryContent: {
      paddingTop: 0,
    },
  }),
  { name: "VariantDetailsChannelsAvailabilityCard" },
);

interface ChannelListProps {
  summary: string;
}

export const ChannelsList: React.FC<ChannelListProps> = ({
  summary,
  children,
}) => {
  const classes = useStyles();
  const expanderClasses = useExpanderStyles({});
  const summaryClasses = useSummaryStyles({});

  return (
    <Accordion classes={expanderClasses}>
      <CardContent className={classes.summaryContent}>
        <AccordionSummary
          expandIcon={<IconChevronDown />}
          classes={summaryClasses}
          data-test-id="channels-variant-availability-summary"
        >
          <Typography variant="caption">{summary}</Typography>
        </AccordionSummary>
      </CardContent>
      {children}
    </Accordion>
  );
};
