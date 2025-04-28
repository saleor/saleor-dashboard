import { appManifestErrorMessages } from "@dashboard/extensions/messages";
import { useCallback } from "react";
import { useIntl } from "react-intl";

export const useValidateUrl = () => {
  const intl = useIntl();

  return useCallback(
    (value: any) => {
      if (typeof value === "string") {
        try {
          new URL(value);

          return true;
        } catch (e) {
          // no-op
        }
      }

      return intl.formatMessage(appManifestErrorMessages.invalidUrlFormat);
    },
    [intl],
  );
};
