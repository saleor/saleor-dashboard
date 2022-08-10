import { Accordion, AccordionSummary, Typography } from "@material-ui/core";
import { ChannelData } from "@saleor/channels/utils";
import IconChevronDown from "@saleor/icons/ChevronDown";
import { makeStyles } from "@saleor/macaw-ui";
import Label from "@saleor/orders/components/OrderHistory/Label";
import React from "react";

import { Messages } from "../types";

const useExpanderStyles = makeStyles(
  theme => ({
    expanded: {},
    root: {
      boxShadow: "none",
      margin: 0,
      padding: 0,
      paddingBottom: theme.spacing(2),

      "&:before": {
        content: "none",
      },

      "&$expanded": {
        margin: 0,
        border: "none",
      },
    },
  }),
  { name: "ChannelContentWrapperExpander" },
);

const useSummaryStyles = makeStyles(
  theme => ({
    expanded: {},
    root: {
      width: "100%",
      border: "none",
      margin: 0,
      padding: 0,
      minHeight: 0,
      paddingTop: theme.spacing(2),

      "&$expanded": {
        minHeight: 0,
        padding: theme.spacing(2, 0),
      },
    },
    content: {
      margin: 0,

      "&$expanded": {
        margin: 0,
      },
    },
  }),
  { name: "ChannelContentWrapperExpanderSummary" },
);

const useStyles = makeStyles(
  () => ({
    container: {
      display: "flex",
      flexDirection: "column",
    },
  }),
  { name: "ChannelWithVariantAvailabilityItemWrapper" },
);

export interface ChannelContentWrapperProps {
  data: ChannelData;
  children: React.ReactNode;
  messages: Messages;
}

const ChannelContentWrapper: React.FC<ChannelContentWrapperProps> = ({
  data,
  messages,
  children,
}) => {
  const expanderClasses = useExpanderStyles();
  const summaryClasses = useSummaryStyles();
  const classes = useStyles();

  const { name } = data;

  return (
    <Accordion
      classes={expanderClasses}
      data-test-id="channel-availability-item"
    >
      <AccordionSummary
        expandIcon={<IconChevronDown />}
        classes={summaryClasses}
      >
        <div className={classes.container}>
          <Typography>{name}</Typography>
          <Label text={messages.availableDateText} />
        </div>
      </AccordionSummary>
      {children}
    </Accordion>
  );
};

export default ChannelContentWrapper;
