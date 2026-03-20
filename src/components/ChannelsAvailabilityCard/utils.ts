// @ts-strict-ignore
import { type ChannelData } from "@dashboard/channels/utils";
import { type LocalizeDate } from "@dashboard/hooks/useDateLocalize";
import { type IntlShape } from "react-intl";

import { publicationMessages } from "./messages";
import { type Messages } from "./types";

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
          currVal.publishedAt && !currVal.isPublished
            ? intl.formatMessage(publicationMessages.willBecomePublishedOn, {
                date: localizeDate(currVal.publishedAt, "llll"),
              })
            : currVal.publishedAt
              ? intl.formatMessage(publicationMessages.publishedSince, {
                  date: localizeDate(currVal.publishedAt, "llll"),
                })
              : currVal.isPublished
                ? intl.formatMessage(publicationMessages.published)
                : intl.formatMessage(publicationMessages.notPublished),
        availableLabel: intl.formatMessage(publicationMessages.availableForPurchase),
        availableSecondLabel: intl.formatMessage(publicationMessages.willBecomeAvailableOn, {
          date: localizeDate(currVal.availableForPurchaseAt, "llll"),
        }),
        hiddenSecondLabel: intl.formatMessage(publicationMessages.willBecomePublishedOn, {
          date: localizeDate(currVal.publishedAt, "llll"),
        }),
        setAvailabilityDateLabel: intl.formatMessage(publicationMessages.setAvailabilityDate),
        unavailableLabel: intl.formatMessage(publicationMessages.unavailableForPurchase),
      },
    }),
    {} as Messages,
  );
