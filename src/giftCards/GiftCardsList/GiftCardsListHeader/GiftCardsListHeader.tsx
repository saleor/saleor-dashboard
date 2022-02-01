import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardMenu, { CardMenuItem } from "@saleor/components/CardMenu";
import PageHeader from "@saleor/components/PageHeader";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardSettingsUrl } from "../../urls";
import { giftCardsListHeaderMenuItemsMessages as messages } from "../messages";
import useGiftCardListDialogs from "../providers/GiftCardListDialogsProvider/hooks/useGiftCardListDialogs";
import GiftCardsListHeaderAlert from "./GiftCardsListHeaderAlert";

const GiftCardsListHeader: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigator();

  const {
    openCreateDialog,
    openBulkCreateDialog,
    openExportDialog
  } = useGiftCardListDialogs();

  const openSettings = () => navigate(giftCardSettingsUrl);

  const menuItems: CardMenuItem[] = [
    {
      label: intl.formatMessage(messages.settings),
      testId: "settingsMenuItem",
      onSelect: openSettings
    },
    {
      label: intl.formatMessage(messages.bulkIssue),
      testId: "bulkIssueMenuItem",
      onSelect: openBulkCreateDialog
    },
    {
      label: intl.formatMessage(messages.exportCodes),
      testId: "exportCodesMenuItem",
      onSelect: openExportDialog
    }
  ];

  return (
    <>
      <PageHeader title={intl.formatMessage(sectionNames.giftCards)}>
        <CardMenu menuItems={menuItems} data-test="menu" />
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
      <VerticalSpacer spacing={2} />
    </>
  );
};

export default GiftCardsListHeader;
