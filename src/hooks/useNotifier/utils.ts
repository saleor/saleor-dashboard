import { IMessage } from "@dashboard/components/messages";
import { commonMessages } from "@dashboard/intl";
import commonErrorMessages from "@dashboard/utils/errors/common";
import { IntlShape } from "react-intl";

export const getDefaultNotifierSuccessErrorData = (errors: any[], intl: IntlShape): IMessage =>
  !errors.length
    ? {
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      }
    : {
        status: "error",
        text: intl.formatMessage(commonErrorMessages.unknownError),
      };
