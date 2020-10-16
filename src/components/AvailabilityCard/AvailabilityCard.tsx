import ChannelsAvailability, {
  ChannelsAvailabilityProps,
  Message
} from "@saleor/components/ChannelsAvailability";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import React from "react";
import { useIntl } from "react-intl";

interface AvailabilityCardProps {
  messages: Message;
}

export const AvailabilityCard: React.FC<AvailabilityCardProps &
  Omit<ChannelsAvailabilityProps, "channelsMessages">> = props => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  return (
    <ChannelsAvailability
      {...props}
      channelsMessages={props.channels.reduce(
        (prevVal, currVal) => ({
          ...prevVal,
          [currVal.id]: {
            ...props.messages,
            availableDateText:
              currVal.publicationDate && !currVal.isPublished
                ? intl.formatMessage(
                    {
                      defaultMessage: "Will become available on {date}",
                      description: "channel publication date"
                    },
                    {
                      date: localizeDate(currVal.publicationDate, "L")
                    }
                  )
                : currVal.publicationDate
                ? intl.formatMessage(
                    {
                      defaultMessage: "Visible since {date}",
                      description: "channel publication date"
                    },
                    {
                      date: localizeDate(currVal.publicationDate, "L")
                    }
                  )
                : currVal.isPublished
                ? intl.formatMessage({
                    defaultMessage: "Visible",
                    description: "channel publication status"
                  })
                : intl.formatMessage({
                    defaultMessage: "Hidden",
                    description: "channel publication status"
                  }),
            availableLabel: intl.formatMessage({
              defaultMessage: "Available for purchase",
              description: "product availability"
            }),
            availableSecondLabel: intl.formatMessage(
              {
                defaultMessage: "will become available on {date}",
                description: "product available for purchase date"
              },
              {
                date: localizeDate(currVal.availableForPurchase, "L")
              }
            ),
            hiddenSecondLabel: intl.formatMessage(
              {
                defaultMessage: "will become published on {date}",
                description: "product publication date label"
              },
              {
                date: localizeDate(currVal.publicationDate, "L")
              }
            ),
            setAvailabilityDateLabel: intl.formatMessage({
              defaultMessage: "Set availability date",
              description: "product availability date label"
            }),
            unavailableLabel: intl.formatMessage({
              defaultMessage: "Unavailable for purchase",
              description: "product unavailability"
            })
          }
        }),
        {}
      )}
    />
  );
};

export default AvailabilityCard;
