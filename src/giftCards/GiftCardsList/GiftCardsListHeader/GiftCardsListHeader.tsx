import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Button } from "@dashboard/components/Button";
import CardMenu, { CardMenuItem } from "@dashboard/components/CardMenu";
import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardSettingsUrl } from "../../urls";
import { giftCardsListHeaderMenuItemsMessages as messages } from "../messages";
import { useGiftCardListDialogs } from "../providers/GiftCardListDialogsProvider";
import GiftCardsListHeaderAlert from "./GiftCardsListHeaderAlert";

const GiftCardsListHeader: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigator();

  const { openCreateDialog, openBulkCreateDialog, openExportDialog } =
    useGiftCardListDialogs();

  const openSettings = () => navigate(giftCardSettingsUrl);

  const menuItems: CardMenuItem[] = [
    {
      label: intl.formatMessage(messages.settings),
      testId: "settingsMenuItem",
      onSelect: openSettings,
    },
    {
      label: intl.formatMessage(messages.bulkIssue),
      testId: "bulkIssueMenuItem",
      onSelect: openBulkCreateDialog,
    },
    {
      label: intl.formatMessage(messages.exportCodes),
      testId: "exportCodesMenuItem",
      onSelect: openExportDialog,
    },
  ];

  return (
    <>
      <TopNav title={intl.formatMessage(sectionNames.giftCards)}>
        <CardMenu menuItems={menuItems} data-test-id="menu" />
        <HorizontalSpacer spacing={2} />
        <Button
          variant="primary"
          onClick={openCreateDialog}
          data-test-id="issue-card-button"
        >
          {intl.formatMessage(messages.issueButtonLabel)}
        </Button>
      </TopNav>
      <GiftCardsListHeaderAlert />
    </>
  );
};

export default GiftCardsListHeader;
