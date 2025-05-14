import { commonMessages } from "@dashboard/intl";
import { IntlShape } from "react-intl";
import { z } from "zod";

import { appManifestErrorMessages } from "../../messages";

export const getFormSchema = (intl: IntlShape) => {
  return z.object({
    manifestUrl: z
      .string()
      .min(1, intl.formatMessage(commonMessages.requiredField))
      .url(intl.formatMessage(appManifestErrorMessages.invalidUrlFormat)),
  });
};

export type ExtensionInstallFormData = z.infer<ReturnType<typeof getFormSchema>>;
