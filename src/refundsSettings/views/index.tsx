import { WindowTitle } from "@dashboard/components/WindowTitle";
import { sectionNames } from "@dashboard/intl";
import { RefundsSettingsPage } from "@dashboard/refundsSettings/components/RefundsSettingsPage/RefundsSettingsPage";
import React from "react";
import { useIntl } from "react-intl";

export const RefundsSettingsView = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.refundsSettings)} />
      <RefundsSettingsPage />
    </>
  );
};
