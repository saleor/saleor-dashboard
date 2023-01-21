import { useIntl } from "react-intl";

import { GetV2SaleorAppsResponse } from "../marketplace.types";
import { appsMessages } from "../messages";
import { AppLink } from "../types";
import { isAppComingSoon } from "../utils";

function useAppLinks(app: GetV2SaleorAppsResponse.SaleorApp): AppLink[] {
  const intl = useIntl();

  if (isAppComingSoon(app)) {
    return [];
  }

  return [
    {
      name: intl.formatMessage(appsMessages.repository),
      url: app.repositoryUrl,
    },
    {
      name: intl.formatMessage(appsMessages.support),
      url: app.supportUrl,
    },
    {
      name: intl.formatMessage(appsMessages.dataPrivacy),
      url: app.privacyUrl,
    },
  ];
}
export default useAppLinks;
