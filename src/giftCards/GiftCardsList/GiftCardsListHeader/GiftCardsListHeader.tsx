import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import { Button } from "@saleor/components/Button";
import CardMenu, { CardMenuItem } from "@saleor/components/CardMenu";
import PageHeader from "@saleor/components/PageHeader";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardSettingsUrl } from "../../urls";
import { giftCardsListHeaderMenuItemsMessages as messages } from "../messages";
import { useGiftCardListDialogs } from "../providers/GiftCardListDialogsProvider";
import GiftCardsListHeaderAlert from "./GiftCardsListHeaderAlert";

const GiftCardsListHeader: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigator();

  const {
    openCreateDialog,
    openBulkCreateDialog,
    openExportDialog,
  } = useGiftCardListDialogs();

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
      <PageHeader
        preview
        title={intl.formatMessage(sectionNames.giftCards)}
        cardMenu={<CardMenu menuItems={menuItems} data-test-id="menu" />}
      >
        <HorizontalSpacer spacing={2} />
        <Button
          variant="primary"
          onClick={openCreateDialog}
          data-test-id="issue-card-button"
        >
          {intl.formatMessage(messages.issueButtonLabel)}
        </Button>
      </PageHeader>
      <GiftCardsListHeaderAlert />
    </>
  );
};

export default GiftCardsListHeader;
