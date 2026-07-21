// @ts-strict-ignore
import CardSpacer from "@dashboard/components/CardSpacer";
import Link from "@dashboard/components/Link";
import { type INotification } from "@dashboard/components/notifications";
import { customerUrl } from "@dashboard/customers/urls";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { GiftCardEventsEnum, useGiftCardUnassignUserMutation } from "@dashboard/graphql";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getFullName } from "@dashboard/misc";
import Label from "@dashboard/orders/components/OrderHistory/Label";
import { getOrderNumberLinkObject } from "@dashboard/orders/components/OrderHistory/utils";
import { getByType } from "@dashboard/orders/components/OrderReturnPage/utils";
import { productUrl } from "@dashboard/products/urls";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import commonErrorMessages from "@dashboard/utils/errors/common";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { type MessageDescriptor, useIntl } from "react-intl";

import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardUpdateDialogs from "../providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import { GIFT_CARD_DETAILS_QUERY } from "../queries";
import { PLACEHOLDER } from "../types";
import { giftCardUpdateInfoCardMessages as messages } from "./messages";

const GiftCardUpdateInfoCardContent = () => {
  const intl = useIntl();
  const notify = useNotifier();
  const localizeDate = useDateLocalize();
  const { giftCard } = useGiftCardDetails();
  const { openAssignCustomerDialog } = useGiftCardUpdateDialogs();
  const { id, created, createdByEmail, createdBy, product, assignedTo, assignedToEmail } = giftCard;
  const [unassignUser, unassignUserOpts] = useGiftCardUnassignUserMutation({
    onCompleted: data => {
      const errors = data?.giftCardUnassignUser?.errors;
      const notifierData: INotification = errors?.length
        ? {
            status: "error",
            text: intl.formatMessage(commonErrorMessages.unknownError),
          }
        : {
            status: "success",
            text: intl.formatMessage(messages.unassignSuccess),
          };

      notify(notifierData);
    },
    refetchQueries: [GIFT_CARD_DETAILS_QUERY],
  });
  const isAssigned = !!(assignedTo || assignedToEmail);
  const cardIssuedEvent = giftCard?.events?.find(getByType(GiftCardEventsEnum.ISSUED));
  const cardBoughtEvent = giftCard?.events?.find(getByType(GiftCardEventsEnum.BOUGHT));

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
          url: ExtensionsUrls.resolveViewManifestExtensionUrl(app?.id),
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

      <Label text={intl.formatMessage(messages.assignedToLabel)} />
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
        {isAssigned ? (
          assignedTo ? (
            <Link href={customerUrl(assignedTo.id)}>
              {getFullName(assignedTo) || assignedToEmail}
            </Link>
          ) : (
            <Text>{assignedToEmail}</Text>
          )
        ) : (
          <Text>{PLACEHOLDER}</Text>
        )}
        <Box display="flex" gap={1}>
          <Button
            variant="secondary"
            size="small"
            onClick={openAssignCustomerDialog}
            data-test-id="assign-customer"
          >
            {intl.formatMessage(isAssigned ? messages.changeButton : messages.assignButton)}
          </Button>
          {isAssigned && (
            <Button
              variant="tertiary"
              size="small"
              disabled={unassignUserOpts.loading}
              onClick={() => unassignUser({ variables: { id } })}
              data-test-id="unassign-customer"
            >
              {intl.formatMessage(messages.unassignButton)}
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default GiftCardUpdateInfoCardContent;
