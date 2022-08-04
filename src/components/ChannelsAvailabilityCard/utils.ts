import { ChannelData } from "@saleor/channels/utils";
import { LocalizeDate } from "@saleor/hooks/useDateLocalize";
import { IntlShape } from "react-intl";

import { publicationMessages } from "./messages";
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
            ? intl.formatMessage(publicationMessages.willBecomePublishedOn, {
                date: localizeDate(currVal.publicationDate),
              })
            : currVal.publicationDate
            ? intl.formatMessage(publicationMessages.publishedSince, {
                date: localizeDate(currVal.publicationDate),
              })
            : currVal.isPublished
            ? intl.formatMessage(publicationMessages.published)
            : intl.formatMessage(publicationMessages.notPublished),
        availableLabel: intl.formatMessage(
          publicationMessages.availableForPurchase,
        ),
        availableSecondLabel: intl.formatMessage(
          publicationMessages.willBecomeAvailableOn,
          {
            date: localizeDate(currVal.availableForPurchase),
          },
        ),
        hiddenSecondLabel: intl.formatMessage(
          publicationMessages.willBecomePublishedOn,
          {
            date: localizeDate(currVal.publicationDate),
          },
        ),
        setAvailabilityDateLabel: intl.formatMessage(
          publicationMessages.setAvailabilityDate,
        ),
        unavailableLabel: intl.formatMessage(
          publicationMessages.unavailableForPurchase,
        ),
      },
    }),
    {} as Messages,
  );
