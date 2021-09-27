import { Button } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardMenu, { CardMenuItem } from "@saleor/components/CardMenu";
import PageHeader from "@saleor/components/PageHeader";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardSettingsUrl } from "../../urls";
import { giftCardsListHeaderMenuItemsMessages as messages } from "../messages";
import useGiftCardListDialogs from "../providers/GiftCardListDialogsProvider/hooks/useGiftCardListDialogs";
import GiftCardsListHeaderAlert from "./GiftCardsListHeaderAlert";

const GiftCardsListHeader: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigator();

  const { openCreateDialog } = useGiftCardListDialogs();

  const openSettings = () => navigate(giftCardSettingsUrl);

  const menuItems: CardMenuItem[] = [
    {
      label: intl.formatMessage(messages.settings),
      testId: "settingsMenuItem",
      onSelect: openSettings
    }
    //   {
    //     label: intl.formatMessage(messages.bulkIssue),
    //     testId: "bulkIssueMenuItem"
    //     //   onSelect:
    //   },
    //   {
    //     label: intl.formatMessage(messages.exportCodes),
    //     testId: "exportCodesMenuItem"
    //     //   onSelect:
    //   }
  ];

  return (
    <>
      <PageHeader title={intl.formatMessage(sectionNames.giftCards)}>
        <CardMenu menuItems={menuItems} data-test="menu" />
        <HorizontalSpacer spacing={2} />
        <Button
          color="primary"
          variant="contained"
          onClick={openCreateDialog}
          data-test-id="issueCardButton"
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
