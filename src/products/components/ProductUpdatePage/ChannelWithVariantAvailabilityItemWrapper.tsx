import {
  ExpansionPanel,
  ExpansionPanelSummary,
  makeStyles,
  Typography
} from "@material-ui/core";
import { ChannelData } from "@saleor/channels/utils";
import IconChevronDown from "@saleor/icons/ChevronDown";
import Label from "@saleor/orders/components/OrderHistory/Label";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";
import { ChannelsWithVariantsData } from "@saleor/products/views/ProductUpdate/types";
import { areAllChannelVariantsSelected } from "@saleor/products/views/ProductUpdate/utils";
import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";
import { defineMessages } from "react-intl";

const useExpanderStyles = makeStyles(
  () => ({
    expanded: {},
    root: {
      boxShadow: "none",

      "&:before": {
        content: "none"
      },

      "&$expanded": {
        margin: 0,
        border: "none"
      }
    }
  }),
  { name: "ChannelsWithVariantsAvailabilityItemWrapperExpander" }
);

const messages = defineMessages({
  variantCountLabel: {
    defaultMessage: "{variantsCount} variants",
    description: "variants count label"
  },
  allVariantsLabel: {
    defaultMessage: "All variants",
    description: "all variants label"
  }
});

const useStyles = makeStyles(
  () => ({
    container: {
      display: "flex",
      flexDirection: "column"
    }
  }),
  { name: "ChannelsWithVariantsAvailabilityItemWrapper" }
);

interface ChannelAvailabilityItemWrapperProps {
  variants: ProductDetails_product_variants[];
  channelId: string;
  channels: ChannelData[];
  channelsWithVariantsData: ChannelsWithVariantsData;
  availableDateLabel: MessageDescriptor;
}

const ChannelWithVariantsAvailabilityItemWrapper: React.FC<ChannelAvailabilityItemWrapperProps> = ({
  channels,
  channelsWithVariantsData,
  channelId,
  variants,
  availableDateLabel,
  children
}) => {
  const expanderClasses = useExpanderStyles({});
  const classes = useStyles({});
  const intl = useIntl();

  const { name } = channels.find(getById(channelId));
  const { selectedVariantsIds } = channelsWithVariantsData[channelId];

  const variantsCount = selectedVariantsIds.length;

  const variantsLabel = areAllChannelVariantsSelected(variants, {
    selectedVariantsIds
  })
    ? messages.allVariantsLabel
    : messages.variantCountLabel;

  return (
    <ExpansionPanel classes={expanderClasses}>
      <ExpansionPanelSummary
        expandIcon={<IconChevronDown />}
        // classes={summaryClasses}
      >
        <div className={classes.container}>
          <Typography>{name}</Typography>;
          <Label text={intl.formatMessage(variantsLabel, { variantsCount })} />
          <Label text={intl.formatMessage(availableDateLabel)} />
        </div>
      </ExpansionPanelSummary>
      {children}
    </ExpansionPanel>
  );
};

export default ChannelWithVariantsAvailabilityItemWrapper;
