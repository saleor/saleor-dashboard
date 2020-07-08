import { ChannelErrorFragment } from "@saleor/fragments/types/ChannelErrorFragment";
import { commonMessages } from "@saleor/intl";
import { ChannelErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
  channelAlreadyExist: {
    defaultMessage: "This channel has already been created"
  },
  channelUnique: {
    defaultMessage: "Slug must be unique"
  }
});

function getChannelsErrorMessage(
  err: Omit<ChannelErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case ChannelErrorCode.ALREADY_EXISTS:
        return intl.formatMessage(messages.channelAlreadyExist);
      case ChannelErrorCode.UNIQUE:
        return intl.formatMessage(messages.channelUnique);
      case ChannelErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case ChannelErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      case ChannelErrorCode.INVALID:
        return intl.formatMessage(commonErrorMessages.invalid);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getChannelsErrorMessage;
