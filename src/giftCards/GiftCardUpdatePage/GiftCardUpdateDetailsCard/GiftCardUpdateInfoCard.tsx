import { Card, CardContent, Typography } from "@material-ui/core";
import { appUrl } from "@saleor/apps/urls";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Link from "@saleor/components/Link";
import { customerUrl } from "@saleor/customers/urls";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import useNavigator from "@saleor/hooks/useNavigator";
import { getFullName, getStringOrPlaceholder } from "@saleor/misc";
import Label from "@saleor/orders/components/OrderHistory/Label";
import { getOrderNumberLinkObject } from "@saleor/orders/components/OrderHistory/utils";
import { productUrl } from "@saleor/products/urls";
import { staffMemberDetailsUrl } from "@saleor/staff/urls";
import { GiftCardEventsEnum } from "@saleor/types/globalTypes";
import React, { useContext } from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import { GiftCardDetailsContext } from "../GiftCardDetailsProvider";
import { giftCardUpdateInfoCardMessages as messages } from "./messages";

const PLACEHOLDER = "-";

const GiftCardUpdateInfoCard: React.FC = () => {
  const navigate = useNavigator();
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  const {
    giftCard: {
      created,
      createdByEmail,
      createdBy,
      usedByEmail,
      usedBy,
      app,
      product,
      events
    }
  } = useContext(GiftCardDetailsContext);

  const cardIssuedEvent = events.find(
    ({ type }) => type === GiftCardEventsEnum.ISSUED
  );

  const getBuyerFieldData = (): {
    label: MessageDescriptor;
    name: string;
    url?: string;
  } => {
    if (createdByEmail) {
      return {
        label: messages.boughtByLabel,
        name: createdByEmail
      };
    }

    if (app) {
      return {
        label: messages.issuedByAppLabel,
        name: app.name,
        url: appUrl(app.id)
      };
    }

    // createdBy can be either customer or staff hence
    // we check for issued event
    if (!!cardIssuedEvent) {
      return {
        label: messages.issuedByLabel,
        name: getFullName(createdBy),
        url: staffMemberDetailsUrl(createdBy.id)
      };
    }

    return {
      label: messages.boughtByLabel,
      name: getFullName(createdBy),
      url: customerUrl(createdBy.id)
    };
  };

  const orderData =
    cardIssuedEvent && cardIssuedEvent.orderId
      ? getOrderNumberLinkObject({
          id: cardIssuedEvent.orderId,
          number: cardIssuedEvent.orderNumber
        })
      : null;

  const {
    label: buyerLabelMessage,
    name: buyerName,
    url: buyerUrl
  } = getBuyerFieldData();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.title)} />
      <CardContent>
        <Label text={intl.formatMessage(messages.creationLabel)} />
        <Typography>{localizeDate(created, "DD MMMM YYYY")}</Typography>
        <CardSpacer />

        <Label text={intl.formatMessage(messages.orderNumberLabel)} />
        {orderData ? (
          <Link onClick={() => navigate(orderData.link)}>{orderData.text}</Link>
        ) : (
          <Typography>{PLACEHOLDER}</Typography>
        )}
        <CardSpacer />

        <Label text={intl.formatMessage(messages.productLabel)} />
        {product ? (
          <Link onClick={() => navigate(productUrl(product?.id))}>
            {product?.name}
          </Link>
        ) : (
          <Typography>{PLACEHOLDER}</Typography>
        )}
        <CardSpacer />

        <Label text={intl.formatMessage(buyerLabelMessage)} />
        {buyerUrl ? (
          <Link onClick={() => navigate(buyerUrl)}>{buyerName}</Link>
        ) : (
          <Typography>{buyerName}</Typography>
        )}
        <CardSpacer />

        <Label text={intl.formatMessage(messages.usedByLabel)} />
        {usedBy ? (
          <Link onClick={() => navigate(customerUrl(usedBy.id))}>
            {getFullName(usedBy)}
          </Link>
        ) : (
          <Typography>
            {getStringOrPlaceholder(usedByEmail, PLACEHOLDER)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default GiftCardUpdateInfoCard;
