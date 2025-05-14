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

// Due to disabled strictNullChecks in tsconfig.json, we need to use Required<z.infer<...>> to get the correct type
export type ExtensionInstallFormData = Required<z.infer<ReturnType<typeof getFormSchema>>>;
