import { WindowTitle } from "@dashboard/components/WindowTitle";
import { sectionNames } from "@dashboard/intl";
import { ReturnsSettingsPage } from "@dashboard/returnsSettings/components/ReturnsSettingsPage/ReturnsSettingsPage";
import { useIntl } from "react-intl";

export const ReturnsSettingsView = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.returnsSettings)} />
      <ReturnsSettingsPage />
    </>
  );
};
