import {
  CardContent,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography
} from "@material-ui/core";
import Skeleton from "@saleor/components/Skeleton";
import { ProductVariant } from "@saleor/fragments/types/ProductVariant";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import IconChevronDown from "@saleor/icons/ChevronDown";
import { makeStyles } from "@saleor/theme";
import React from "react";
import { useIntl } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "../messages";
import CardContainer from "./VariantDetailsChannelsAvailabilityCardContainer";

const useExpanderStyles = makeStyles(
  () => ({
    expanded: {},
    root: {
      boxShadow: "none",
      margin: 0,
      padding: 0,

      "&:before": {
        content: "none"
      },

      "&$expanded": {
        margin: 0,
        border: "none"
      }
    }
  }),
  { name: "VariantDetailsChannelsAvailabilityCardExpander" }
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
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(5.5),
      paddingBottom: theme.spacing(2),

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
  { name: "VariantDetailsChannelsAvailabilityCardExpanderSummary" }
);

interface VariantDetailsChannelsAvailabilityCardProps {
  variant: ProductVariant;
}

const VariantDetailsChannelsAvailabilityCard: React.FC<VariantDetailsChannelsAvailabilityCardProps> = ({
  variant
}) => {
  const expanderClasses = useExpanderStyles({});
  const summaryClasses = useSummaryStyles({});
  const localizeDate = useDateLocalize();
  const intl = useIntl();

  const getProductChannelListingByChannelId = (channelId: string) =>
    variant?.product.channelListings.find(
      ({ channel }) => channel.id === channelId
    );

  const getItemSubtitle = (channelId: string) => {
    const {
      isPublished,
      publicationDate
    } = getProductChannelListingByChannelId(channelId);

    if (!isPublished) {
      return intl.formatMessage(messages.itemSubtitleHidden);
    }

    return intl.formatMessage(messages.itemSubtitlePublished, {
      publicationDate: localizeDate(publicationDate)
    });
  };

  if (!variant) {
    return (
      <CardContainer>
        <CardContent>
          <Skeleton />
        </CardContent>
      </CardContainer>
    );
  }

  const { channelListings } = variant;

  const isAvailableInAnyChannels = !!channelListings.length;

  const variantChannelListingsChannelsIds = channelListings.map(
    ({ channel: { id } }) => id
  );

  const allAvailableChannelsListings = variant.product.channelListings.filter(
    ({ channel }) => variantChannelListingsChannelsIds.includes(channel.id)
  );

  const publishedInChannelsListings = allAvailableChannelsListings.filter(
    ({ isPublished }) => isPublished
  );

  if (!isAvailableInAnyChannels) {
    return (
      <CardContainer>
        <CardContent>
          <Typography variant="caption">
            {intl.formatMessage(messages.noItemsAvailable)}
          </Typography>
        </CardContent>
      </CardContainer>
    );
  }

  return (
    <CardContainer>
      <ExpansionPanel classes={expanderClasses}>
        <ExpansionPanelSummary
          expandIcon={<IconChevronDown />}
          classes={summaryClasses}
          data-test-id="channels-variant-availability-summary"
        >
          <Typography variant="caption">
            {intl.formatMessage(messages.subtitle, {
              publishedInChannelsCount: publishedInChannelsListings.length,
              availableChannelsCount: allAvailableChannelsListings.length
            })}
          </Typography>
        </ExpansionPanelSummary>

        {channelListings.map(({ channel }) => (
          <React.Fragment key={channel.id}>
            <Divider />
            <CardContent>
              <Typography
                data-test-id={`channels-variant-availability-item-title-${channel.id}`}
              >
                {channel.name}
              </Typography>
              <Typography
                variant="caption"
                data-test-id={`channels-variant-availability-item-subtitle-${channel.id}`}
              >
                {getItemSubtitle(channel.id)}
              </Typography>
            </CardContent>
          </React.Fragment>
        ))}
      </ExpansionPanel>
    </CardContainer>
  );
};

export default VariantDetailsChannelsAvailabilityCard;
