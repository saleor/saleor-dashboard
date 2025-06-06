import { commonMessages } from "@dashboard/intl";
import isUrl from "is-url";
import { IntlShape } from "react-intl";
import { z } from "zod";

export const getValidationSchema = (intl: IntlShape) => {
  return z
    .object({
      name: z
        .string({
          required_error: intl.formatMessage(commonMessages.requiredField),
        })
        .min(1, intl.formatMessage(commonMessages.requiredField)),
      linkType: z
        .string({
          required_error: intl.formatMessage(commonMessages.requiredField),
          invalid_type_error: intl.formatMessage(commonMessages.requiredField),
        })
        .min(1, intl.formatMessage(commonMessages.requiredField)),
      linkValue: z
        .string({
          required_error: intl.formatMessage(commonMessages.requiredField),
        })
        .min(1, intl.formatMessage(commonMessages.requiredField)),
    })
    .refine(
      data => {
        return !(data.linkType === "link" && !isUrl(data.linkValue));
      },
      {
        path: ["linkValue"],
        message: intl.formatMessage({
          defaultMessage: "Invalid URL",
          id: "qzDwLa",
          description: "Invalid url value",
        }),
      },
    );
};
