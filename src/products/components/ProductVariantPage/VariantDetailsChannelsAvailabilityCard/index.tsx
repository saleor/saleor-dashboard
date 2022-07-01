import {
  Accordion,
  AccordionSummary,
  CardContent,
  Divider,
  Typography,
} from "@material-ui/core";
import Skeleton from "@saleor/components/Skeleton";
import { ProductVariantFragment } from "@saleor/graphql";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import IconChevronDown from "@saleor/icons/ChevronDown";
import { makeStyles } from "@saleor/macaw-ui";
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

interface VariantDetailsChannelsAvailabilityCardProps {
  variant: ProductVariantFragment;
}

const VariantDetailsChannelsAvailabilityCard: React.FC<VariantDetailsChannelsAvailabilityCardProps> = ({
  variant,
}) => {
  const classes = useStyles();
  const expanderClasses = useExpanderStyles({});
  const summaryClasses = useSummaryStyles({});
  const localizeDate = useDateLocalize();
  const intl = useIntl();

  const getProductChannelListingByChannelId = (channelId: string) =>
    variant?.product.channelListings.find(
      ({ channel }) => channel.id === channelId,
    );

  const getItemSubtitle = (channelId: string) => {
    const {
      isPublished,
      publicationDate,
    } = getProductChannelListingByChannelId(channelId);

    if (!isPublished) {
      return intl.formatMessage(messages.itemSubtitleHidden);
    }

    return intl.formatMessage(messages.itemSubtitlePublished, {
      publicationDate: localizeDate(publicationDate),
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
    ({ channel: { id } }) => id,
  );

  const allAvailableChannelsListings = variant.product.channelListings.filter(
    ({ channel }) => variantChannelListingsChannelsIds.includes(channel.id),
  );

  const publishedInChannelsListings = allAvailableChannelsListings.filter(
    ({ isPublished }) => isPublished,
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
      <Accordion classes={expanderClasses}>
        <CardContent className={classes.summaryContent}>
          <AccordionSummary
            expandIcon={<IconChevronDown />}
            classes={summaryClasses}
            data-test-id="channels-variant-availability-summary"
          >
            <Typography variant="caption">
              {intl.formatMessage(messages.subtitle, {
                publishedInChannelsCount: publishedInChannelsListings.length,
                availableChannelsCount: allAvailableChannelsListings.length,
              })}
            </Typography>
          </AccordionSummary>
        </CardContent>

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
      </Accordion>
    </CardContainer>
  );
};

export default VariantDetailsChannelsAvailabilityCard;
