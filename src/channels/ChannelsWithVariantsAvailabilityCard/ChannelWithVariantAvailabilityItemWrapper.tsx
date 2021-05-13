import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography
} from "@material-ui/core";
import { ChannelData } from "@saleor/channels/utils";
import { Messages } from "@saleor/components/ChannelsAvailabilityCard/types";
import IconChevronDown from "@saleor/icons/ChevronDown";
import Label from "@saleor/orders/components/OrderHistory/Label";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";
import { ChannelsWithVariantsData } from "@saleor/products/views/ProductUpdate/types";
import { areAllChannelVariantsSelected } from "@saleor/products/views/ProductUpdate/utils";
import { makeStyles } from "@saleor/theme";
import React from "react";
import { useIntl } from "react-intl";
import { defineMessages } from "react-intl";

const useExpanderStyles = makeStyles(
  theme => ({
    expanded: {},
    root: {
      boxShadow: "none",
      margin: 0,
      padding: 0,
      paddingBottom: theme.spacing(2),

      "&:before": {
        content: "none"
      },

      "&$expanded": {
        margin: 0,
        border: "none"
      }
    }
  }),
  { name: "ChannelWithVariantAvailabilityItemWrapperExpander" }
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
        minHeight: 0
      }
    },
    content: {
      margin: 0,

      "&$expanded": {
        margin: 0
      }
    }
  }),
  { name: "ChannelWithVariantAvailabilityItemWrapperSummary" }
);

const useStyles = makeStyles(
  () => ({
    container: {
      display: "flex",
      flexDirection: "column"
    }
  }),
  { name: "ChannelWithVariantAvailabilityItemWrapper" }
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

interface ChannelAvailabilityItemWrapperProps {
  variants: ProductDetails_product_variants[];
  channelId: string;
  channels: ChannelData[];
  channelsWithVariantsData: ChannelsWithVariantsData;
  messages: Messages;
}

const ChannelWithVariantsAvailabilityItemWrapper: React.FC<ChannelAvailabilityItemWrapperProps> = ({
  channels,
  channelsWithVariantsData,
  channelId,
  variants,
  messages: commonChannelMessages,
  children
}) => {
  const expanderClasses = useExpanderStyles({});
  const summaryClasses = useSummaryStyles({});
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
        classes={summaryClasses}
      >
        <div className={classes.container}>
          <Typography>{name}</Typography>
          <Label text={intl.formatMessage(variantsLabel, { variantsCount })} />
          <Label text={commonChannelMessages.availableDateText} />
        </div>
      </ExpansionPanelSummary>
      {children}
    </ExpansionPanel>
  );
};

export default ChannelWithVariantsAvailabilityItemWrapper;
