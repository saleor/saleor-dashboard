import { Button } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardMenu, { CardMenuItem } from "@saleor/components/CardMenu";
import PageHeader from "@saleor/components/PageHeader";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { Notification } from "@saleor/macaw-ui";
import { productAddUrl } from "@saleor/products/urls";
import { productTypeAddUrl } from "@saleor/productTypes/urls";
import { ProductTypeKindEnum } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardSettingsUrl } from "../../urls";
import { giftCardsListHeaderMenuItemsMessages as messages } from "../messages";
import useGiftCardListDialogs from "../providers/GiftCardListDialogsProvider/hooks/useGiftCardListDialogs";
import { useGiftCardProductsCountQuery } from "../queries";
import { useHeaderStyles as useStyles } from "../styles";
import GiftCardsListHeaderNotificationContent from "./GiftCardsListHeaderContent";

const GiftCardsListHeader: React.FC = () => {
  const intl = useIntl();
  const classes = useStyles({});
  const navigate = useNavigator();

  const { openCreateDialog } = useGiftCardListDialogs();

  const {
    data: giftCardProductsCount,
    loading: giftCardProductsCountLoading
  } = useGiftCardProductsCountQuery();

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

  const giftCardProductTypesExist =
    giftCardProductsCount?.giftCardProductTypes.totalCount === 0;
  const giftCardProductsExist =
    giftCardProductsCount?.giftCardProducts.totalCount === 0;

  const showNoGiftCardProductsNotification =
    !giftCardProductsCountLoading &&
    (!giftCardProductTypesExist || !giftCardProductsExist);

  const handleCreateGiftCardProductType = () =>
    navigate(
      productTypeAddUrl({
        kind: ProductTypeKindEnum.GIFT_CARD
      })
    );
  const handleCreateGiftCardProduct = () => navigate(productAddUrl());

  return (
    <>
      <PageHeader title={intl.formatMessage(sectionNames.giftCards)}>
        <CardMenu menuItems={menuItems} data-test="menu" />
        <HorizontalSpacer spacing={2} />
        <Button color="primary" variant="contained" onClick={openCreateDialog}>
          {intl.formatMessage(messages.issueButtonLabel)}
        </Button>
      </PageHeader>
      {showNoGiftCardProductsNotification && (
        <Notification
          title={intl.formatMessage(messages.noGiftCardsNotificationTitle)}
          content={
            <GiftCardsListHeaderNotificationContent
              giftCardProductTypesExist={giftCardProductTypesExist}
              giftCardProductsExist={giftCardProductsExist}
              handleCreateGiftCardProductType={handleCreateGiftCardProductType}
              handleCreateGiftCardProduct={handleCreateGiftCardProduct}
            />
          }
          type="warning"
          onClose={() => undefined}
          className={classes.notification}
        />
      )}
      <VerticalSpacer spacing={2} />
    </>
  );
};

export default GiftCardsListHeader;
