import { IMessage } from "@saleor/components/messages";
import { commonMessages } from "@saleor/intl";
import commonErrorMessages from "@saleor/utils/errors/common";
import { IntlShape } from "react-intl";

export const getDefaultNotifierSuccessErrorData = (
  errors: any[],
  intl: IntlShape,
): IMessage =>
  !errors.length
    ? {
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      }
    : {
        status: "error",
        text: intl.formatMessage(commonErrorMessages.unknownError),
      };
