import { ChannelData } from "@saleor/channels/utils";
import { LocalizeDate } from "@saleor/hooks/useDateLocalize";
import { IntlShape } from "react-intl";

import { Messages } from "./types";

export const getChannelsAvailabilityMessages = ({
  messages,
  channels = [],
  intl,
  localizeDate,
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
                  id: "nfbabo",
                  defaultMessage: "Will become available on {date}",
                  description: "channel publication date",
                },
                {
                  date: localizeDate(currVal.publicationDate, "L"),
                },
              )
            : currVal.publicationDate
            ? intl.formatMessage(
                {
                  id: "DIrxt7",
                  defaultMessage: "Visible since {date}",
                  description: "channel publication date",
                },
                {
                  date: localizeDate(currVal.publicationDate, "L"),
                },
              )
            : currVal.isPublished
            ? intl.formatMessage({
                id: "mDgOmP",
                defaultMessage: "Visible",
                description: "channel publication status",
              })
            : intl.formatMessage({
                id: "beuxAP",
                defaultMessage: "Hidden",
                description: "channel publication status",
              }),
        availableLabel: intl.formatMessage({
          id: "P/oGtb",
          defaultMessage: "Available for purchase",
          description: "product availability",
        }),
        availableSecondLabel: intl.formatMessage(
          {
            id: "KSp+8B",
            defaultMessage: "will become available on {date}",
            description: "product available for purchase date",
          },
          {
            date: localizeDate(currVal.availableForPurchase, "L"),
          },
        ),
        hiddenSecondLabel: intl.formatMessage(
          {
            id: "hAcUEl",
            defaultMessage: "will become published on {date}",
            description: "product publication date label",
          },
          {
            date: localizeDate(currVal.publicationDate, "L"),
          },
        ),
        setAvailabilityDateLabel: intl.formatMessage({
          id: "YFQBs1",
          defaultMessage: "Set availability date",
          description: "product availability date label",
        }),
        unavailableLabel: intl.formatMessage({
          id: "Y9lv8z",
          defaultMessage: "Unavailable for purchase",
          description: "product unavailability",
        }),
      },
    }),
    {} as Messages,
  );
