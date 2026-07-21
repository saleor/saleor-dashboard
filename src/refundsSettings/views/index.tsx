import { WindowTitle } from "@dashboard/components/WindowTitle";
import { sectionNames } from "@dashboard/intl";
import { RefundsSettings } from "@dashboard/refundsSettings/views/RefundsSettings";
import { useIntl } from "react-intl";

export const RefundsSettingsView = (): JSX.Element => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.refundsSettings)} />
      <RefundsSettings />
    </>
  );
};
