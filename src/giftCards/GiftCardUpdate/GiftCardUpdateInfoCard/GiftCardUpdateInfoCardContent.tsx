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
import { Typography } from "@material-ui/core";
import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { PLACEHOLDER } from "../types";
import { giftCardUpdateInfoCardMessages as messages } from "./messages";

const GiftCardUpdateInfoCardContent: React.FC = () => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const { giftCard } = useGiftCardDetails();
  const { created, createdByEmail, createdBy, usedByEmail, usedBy, product, events } = giftCard;
  const cardIssuedEvent = events.find(getByType(GiftCardEventsEnum.ISSUED));
  const cardBoughtEvent = events.find(getByType(GiftCardEventsEnum.BOUGHT));
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
      <Typography>{localizeDate(created)}</Typography>
      <CardSpacer />

      <Label text={intl.formatMessage(messages.orderNumberLabel)} />
      {orderData ? (
        <Link href={orderData.link}>{orderData.text}</Link>
      ) : (
        <Typography>{PLACEHOLDER}</Typography>
      )}
      <CardSpacer />

      <Label text={intl.formatMessage(messages.productLabel)} />
      {product ? (
        <Link href={productUrl(product?.id)}>{product?.name}</Link>
      ) : (
        <Typography>{PLACEHOLDER}</Typography>
      )}
      <CardSpacer />

      <Label text={intl.formatMessage(buyerLabelMessage)} />
      {buyerUrl ? <Link href={buyerUrl}>{buyerName}</Link> : <Typography>{buyerName}</Typography>}
      <CardSpacer />

      <Label text={intl.formatMessage(messages.usedByLabel)} />
      {usedBy ? (
        <Link href={customerUrl(usedBy.id)}>{getFullName(usedBy)}</Link>
      ) : (
        <Typography>{getStringOrPlaceholder(usedByEmail, PLACEHOLDER)}</Typography>
      )}
    </>
  );
};

export default GiftCardUpdateInfoCardContent;
