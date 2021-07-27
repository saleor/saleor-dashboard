import { Button } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import CardMenu, { CardMenuItem } from "@saleor/components/CardMenu";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardsListHeaderMenuItemsMessages as messages } from "./messages";

const GiftCardsListHeader: React.FC = () => {
  const intl = useIntl();

  const [openModal, closeModal] = createDialogActionHandlers<
    CollectionListUrlDialog,
    CollectionListUrlQueryParams
  >(navigate, collectionListUrl, params);

  const menuItems: CardMenuItem[] = [
    {
      label: intl.formatMessage(messages.settings),
      testId: "settingsMenuItem"
      //   onSelect:
    },
    {
      label: intl.formatMessage(messages.bulkIssue),
      testId: "bulkIssueMenuItem"
      //   onSelect:
    },
    {
      label: intl.formatMessage(messages.exportCodes),
      testId: "exportCodesMenuItem"
      //   onSelect:
    }
  ];

  return (
    <PageHeader title={intl.formatMessage(sectionNames.giftCards)}>
      <CardMenu menuItems={menuItems} data-test="menu" />
      <HorizontalSpacer spacing={2} />
      <Button color="primary" variant="contained" onClick={openModal}>
        {intl.formatMessage(messages.issueButtonLabel)}
      </Button>
    </PageHeader>
  );
};

export default GiftCardsListHeader;
