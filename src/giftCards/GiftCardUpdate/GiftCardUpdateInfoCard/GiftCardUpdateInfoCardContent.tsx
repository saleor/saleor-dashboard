import { Typography } from "@material-ui/core";
import { appUrl } from "@saleor/apps/urls";
import CardSpacer from "@saleor/components/CardSpacer";
import Link from "@saleor/components/Link";
import { customerUrl } from "@saleor/customers/urls";
import { GiftCardEventsEnum } from "@saleor/graphql";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { getFullName, getStringOrPlaceholder } from "@saleor/misc";
import Label from "@saleor/orders/components/OrderHistory/Label";
import { getOrderNumberLinkObject } from "@saleor/orders/components/OrderHistory/utils";
import { getByType } from "@saleor/orders/components/OrderReturnPage/utils";
import { productUrl } from "@saleor/products/urls";
import { staffMemberDetailsUrl } from "@saleor/staff/urls";
import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { PLACEHOLDER } from "../types";
import { giftCardUpdateInfoCardMessages as messages } from "./messages";

const GiftCardUpdateInfoCardContent: React.FC = () => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  const { giftCard } = useGiftCardDetails();

  const {
    created,
    createdByEmail,
    createdBy,
    usedByEmail,
    usedBy,
    product,
    events,
  } = giftCard;

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
          url: appUrl(app?.id),
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

  const {
    label: buyerLabelMessage,
    name: buyerName,
    url: buyerUrl,
  } = getBuyerFieldData();

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
      {buyerUrl ? (
        <Link href={buyerUrl}>{buyerName}</Link>
      ) : (
        <Typography>{buyerName}</Typography>
      )}
      <CardSpacer />

      <Label text={intl.formatMessage(messages.usedByLabel)} />
      {usedBy ? (
        <Link href={customerUrl(usedBy.id)}>{getFullName(usedBy)}</Link>
      ) : (
        <Typography>
          {getStringOrPlaceholder(usedByEmail, PLACEHOLDER)}
        </Typography>
      )}
    </>
  );
};

export default GiftCardUpdateInfoCardContent;
