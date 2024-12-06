// @ts-strict-ignore
import { AppUrls } from "@dashboard/apps/urls";
import CardSpacer from "@dashboard/components/CardSpacer";
import Link from "@dashboard/components/Link";
import { customerUrl } from "@dashboard/customers/urls";
import { GiftCardEventsEnum } from "@dashboard/graphql";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { getFullName, getStringOrPlaceholder } from "@dashboard/misc";
import Label from "@dashboard/orders/components/OrderHistory/Label";
import { getOrderNumberLinkObject } from "@dashboard/orders/components/OrderHistory/utils";
import { getByType } from "@dashboard/orders/components/OrderReturnPage/utils";
import { productUrl } from "@dashboard/products/urls";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import useGiftCardHistoryEvents from "../GiftCardHistory/hooks/useGiftCardHistoryEvents";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { PLACEHOLDER } from "../types";
import { giftCardUpdateInfoCardMessages as messages } from "./messages";

const GiftCardUpdateInfoCardContent = () => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const { giftCard } = useGiftCardDetails();
  const { created, createdByEmail, createdBy, usedByEmail, usedBy, product } = giftCard;

  const { events } = useGiftCardHistoryEvents();
  const cardIssuedEvent = events?.find(getByType(GiftCardEventsEnum.ISSUED));
  const cardBoughtEvent = events?.find(getByType(GiftCardEventsEnum.BOUGHT));

  const getBuyerFieldData = (): {
    label: MessageDescriptor;
    name: string;
    url?: string;
  } => {
    // createdBy can be either customer or staff hence
    // we check for issued event
    if (cardIssuedEvent) {
      const { app } = cardIssuedEvent;

      if (app) {
        return {
          label: messages.issuedByAppLabel,
          name: app?.name,
          url: AppUrls.resolveAppUrl(app?.id),
        };
      }

      const userName = getFullName(createdBy);

      return {
        label: messages.issuedByLabel,
        name: userName || createdByEmail,
        url: staffMemberDetailsUrl(createdBy?.id),
      };
    }

    if (createdByEmail) {
      return {
        label: messages.boughtByLabel,
        name: createdByEmail,
      };
    }

    return {
      label: messages.boughtByLabel,
      name: getFullName(createdBy),
      url: customerUrl(createdBy?.id),
    };
  };
  const getOrderData = () => {
    if (cardIssuedEvent) {
      const { orderId, orderNumber } = cardIssuedEvent;

      if (!orderId) {
        return null;
      }

      return getOrderNumberLinkObject({
        id: orderId,
        number: orderNumber,
      });
    }

    if (cardBoughtEvent) {
      const { orderId, orderNumber } = cardBoughtEvent;

      return getOrderNumberLinkObject({
        id: orderId,
        number: orderNumber,
      });
    }

    return null;
  };
  const { label: buyerLabelMessage, name: buyerName, url: buyerUrl } = getBuyerFieldData();
  const orderData = getOrderData();

  return (
    <>
      <Label text={intl.formatMessage(messages.creationLabel)} />
      <Text>{localizeDate(created)}</Text>
      <CardSpacer />

      <Label text={intl.formatMessage(messages.orderNumberLabel)} />
      {orderData ? <Link href={orderData.link}>{orderData.text}</Link> : <Text>{PLACEHOLDER}</Text>}
      <CardSpacer />

      <Label text={intl.formatMessage(messages.productLabel)} />
      {product ? (
        <Link href={productUrl(product?.id)}>{product?.name}</Link>
      ) : (
        <Text>{PLACEHOLDER}</Text>
      )}
      <CardSpacer />

      <Label text={intl.formatMessage(buyerLabelMessage)} />
      {buyerUrl ? <Link href={buyerUrl}>{buyerName}</Link> : <Text>{buyerName}</Text>}
      <CardSpacer />

      <Label text={intl.formatMessage(messages.usedByLabel)} />
      {usedBy ? (
        <Link href={customerUrl(usedBy.id)}>{getFullName(usedBy)}</Link>
      ) : (
        <Text>{getStringOrPlaceholder(usedByEmail, PLACEHOLDER)}</Text>
      )}
    </>
  );
};

export default GiftCardUpdateInfoCardContent;
