import { ChannelData } from "@saleor/channels/utils";
import { LocalizeDate } from "@saleor/hooks/useDateLocalize";
import { IntlShape } from "react-intl";

import { Messages } from "./types";

export const getChannelsAvailabilityMessages = ({
  messages,
  channels = [],
  intl,
  localizeDate
}: {
  messages?: Messages;
  channels?: ChannelData[];
  intl: IntlShape;
  localizeDate: LocalizeDate;
}): Messages =>
  channels.reduce(
    (prevVal, currVal) => ({
      ...prevVal,
      [currVal.id]: {
        ...messages,
        availableDateText:
          currVal.publicationDate && !currVal.isPublished
            ? intl.formatMessage(
                {
                  defaultMessage: "Will become available on {date}",
                  description: "channel publication date",
                  id: "channel publication date will become available"
                },
                {
                  date: localizeDate(currVal.publicationDate, "L")
                }
              )
            : currVal.publicationDate
            ? intl.formatMessage(
                {
                  defaultMessage: "Visible since {date}",
                  description: "channel publication date",
                  id: "channel publication date visible since"
                },
                {
                  date: localizeDate(currVal.publicationDate, "L")
                }
              )
            : currVal.isPublished
            ? intl.formatMessage({
                defaultMessage: "Visible",
                description: "channel publication status",
                id: "channel visible"
              })
            : intl.formatMessage({
                defaultMessage: "Hidden",
                description: "channel publication status",
                id: "channel hidden"
              }),
        availableLabel: intl.formatMessage({
          defaultMessage: "Available for purchase",
          description: "product availability",
          id: "product available for purchase"
        }),
        availableSecondLabel: intl.formatMessage(
          {
            defaultMessage: "will become available on {date}",
            description: "product available for purchase date",
            id: "will become available on"
          },
          {
            date: localizeDate(currVal.availableForPurchase, "L")
          }
        ),
        hiddenSecondLabel: intl.formatMessage(
          {
            defaultMessage: "will become published on {date}",
            description: "product publication date label",
            id: "will become published on"
          },
          {
            date: localizeDate(currVal.publicationDate, "L")
          }
        ),
        setAvailabilityDateLabel: intl.formatMessage({
          defaultMessage: "Set availability date",
          description: "product availability date label",
          id: "set availability date"
        }),
        unavailableLabel: intl.formatMessage({
          defaultMessage: "Unavailable for purchase",
          description: "product unavailability",
          id: "unavailable for purchase"
        })
      }
    }),
    {} as Messages
  );
