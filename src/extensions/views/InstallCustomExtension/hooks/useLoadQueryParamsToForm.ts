import { ExtensionInstallQueryParams, MANIFEST_ATTR } from "@dashboard/extensions/urls";
import { useEffect } from "react";

export const useLoadQueryParamsToForm = ({
  trigger,
  onSubmit,
  params,
}: {
  trigger: any;
  onSubmit: any;
  params: ExtensionInstallQueryParams;
}) => {
  useEffect(() => {
    if (params[MANIFEST_ATTR]) {
      (async () => {
        await trigger();
        await onSubmit();
      })();
    }
    // Run this only once on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
