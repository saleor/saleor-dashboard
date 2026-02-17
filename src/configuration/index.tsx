// @ts-strict-ignore
import { useUser } from "@dashboard/auth/useUser";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { APP_VERSION as dashboardVersion } from "@dashboard/config";
import useShop from "@dashboard/hooks/useShop";
import { sectionNames } from "@dashboard/intl";
import { maybe } from "@dashboard/misc";
import { useIntl } from "react-intl";

import { ConfigurationPage } from "./ConfigurationPage";
import { createConfigurationMenu } from "./createConfigurationMenu";

const ConfigurationSection = () => {
  const shop = useShop();
  const versions = {
    dashboardVersion,
    coreVersion: shop?.version ?? "",
  };
  const user = useUser();
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.configuration)} />
      <ConfigurationPage
        menu={createConfigurationMenu(intl)}
        user={maybe(() => user.user)}
        versionInfo={versions}
      />
    </>
  );
};

export default ConfigurationSection;
