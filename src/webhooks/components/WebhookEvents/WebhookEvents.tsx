import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Hr from "@saleor/components/Hr";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { WebhookEventTypeEnum } from "@saleor/types/globalTypes";
import { toggle } from "@saleor/utils/lists";
import React from "react";
import { useIntl } from "react-intl";

interface WebhookEventsProps {
  data: {
    allEvents: boolean;
    events: string[];
  };
  disabled: boolean;
  onChange: (event: ChangeEvent, cb?: () => void) => void;
}

const WebhookEvents: React.FC<WebhookEventsProps> = ({
  data,
  disabled,
  onChange
}) => {
  const intl = useIntl();
  const eventsEnum = Object.values(WebhookEventTypeEnum);

  const translatedEvents: Record<WebhookEventTypeEnum, string> = {
    [WebhookEventTypeEnum.ANY_EVENTS]: intl.formatMessage({
      id: "RrZYME",
      defaultMessage: "All events",
      description: "event"
    }),
    [WebhookEventTypeEnum.CHECKOUT_CREATED]: intl.formatMessage({
      id: "OA5hu8",
      defaultMessage: "Checkout created",
      description: "event"
    }),
    [WebhookEventTypeEnum.CHECKOUT_UPDATED]: intl.formatMessage({
      id: "P3e0J8",
      defaultMessage: "Checkout updated",
      description: "event"
    }),
    [WebhookEventTypeEnum.CUSTOMER_CREATED]: intl.formatMessage({
      id: "9xcy2J",
      defaultMessage: "Customer created",
      description: "event"
    }),
    [WebhookEventTypeEnum.CUSTOMER_UPDATED]: intl.formatMessage({
      id: "CT5fFW",
      defaultMessage: "Customer updated",
      description: "event"
    }),
    [WebhookEventTypeEnum.CHECKOUT_CREATED]: intl.formatMessage({
      id: "OA5hu8",
      defaultMessage: "Checkout created",
      description: "event"
    }),
    [WebhookEventTypeEnum.CHECKOUT_UPDATED]: intl.formatMessage({
      id: "P3e0J8",
      defaultMessage: "Checkout updated",
      description: "event"
    }),
    [WebhookEventTypeEnum.ORDER_CANCELLED]: intl.formatMessage({
      id: "/BlXhU",
      defaultMessage: "Order cancelled",
      description: "event"
    }),
    [WebhookEventTypeEnum.ORDER_CREATED]: intl.formatMessage({
      id: "odB08s",
      defaultMessage: "Order created",
      description: "event"
    }),
    [WebhookEventTypeEnum.ORDER_CONFIRMED]: intl.formatMessage({
      id: "D19Erm",
      defaultMessage: "Order confirmed",
      description: "event"
    }),
    [WebhookEventTypeEnum.ORDER_FULFILLED]: intl.formatMessage({
      id: "OS2bVD",
      defaultMessage: "Order fulfilled",
      description: "event"
    }),
    [WebhookEventTypeEnum.ORDER_FULLY_PAID]: intl.formatMessage({
      id: "ccRHBV",
      defaultMessage: "Order fully paid",
      description: "event"
    }),
    [WebhookEventTypeEnum.ORDER_UPDATED]: intl.formatMessage({
      id: "P5GKo4",
      defaultMessage: "Order updated",
      description: "event"
    }),
    [WebhookEventTypeEnum.DRAFT_ORDER_CREATED]: intl.formatMessage({
      id: "VA7xDO",
      defaultMessage: "Draft order created",
      description: "event"
    }),
    [WebhookEventTypeEnum.DRAFT_ORDER_DELETED]: intl.formatMessage({
      id: "AXy0No",
      defaultMessage: "Draft order deleted",
      description: "event"
    }),
    [WebhookEventTypeEnum.DRAFT_ORDER_UPDATED]: intl.formatMessage({
      id: "RlmdVD",
      defaultMessage: "Draft order updated",
      description: "event"
    }),
    [WebhookEventTypeEnum.SALE_CREATED]: intl.formatMessage({
      id: "EkgU2Y",
      defaultMessage: "Sale created",
      description: "event"
    }),
    [WebhookEventTypeEnum.SALE_UPDATED]: intl.formatMessage({
      id: "OGVvkb",
      defaultMessage: "Sale updated",
      description: "event"
    }),
    [WebhookEventTypeEnum.SALE_DELETED]: intl.formatMessage({
      id: "lySsBG",
      defaultMessage: "Sale deleted",
      description: "event"
    }),
    [WebhookEventTypeEnum.PAGE_CREATED]: intl.formatMessage({
      id: "tjAWvw",
      defaultMessage: "Page created",
      description: "event"
    }),
    [WebhookEventTypeEnum.PAGE_DELETED]: intl.formatMessage({
      id: "8PYN4w",
      defaultMessage: "Page deleted",
      description: "event"
    }),
    [WebhookEventTypeEnum.PAGE_UPDATED]: intl.formatMessage({
      id: "ovRcH7",
      defaultMessage: "Page updated",
      description: "event"
    }),
    [WebhookEventTypeEnum.PAYMENT_AUTHORIZE]: intl.formatMessage({
      id: "zG7DDH",
      defaultMessage: "Authorize payment",
      description: "event"
    }),
    [WebhookEventTypeEnum.PAYMENT_CAPTURE]: intl.formatMessage({
      id: "NZbUEE",
      defaultMessage: "Capture payment",
      description: "event"
    }),
    [WebhookEventTypeEnum.PAYMENT_CONFIRM]: intl.formatMessage({
      id: "OYaVVk",
      defaultMessage: "Confirm payment",
      description: "event"
    }),
    [WebhookEventTypeEnum.PAYMENT_LIST_GATEWAYS]: intl.formatMessage({
      id: "gkdNcW",
      defaultMessage: "List payment gateways",
      description: "event"
    }),
    [WebhookEventTypeEnum.PAYMENT_PROCESS]: intl.formatMessage({
      id: "JvtaTu",
      defaultMessage: "Process payment",
      description: "event"
    }),
    [WebhookEventTypeEnum.PAYMENT_REFUND]: intl.formatMessage({
      id: "4nIMbD",
      defaultMessage: "Refund payment",
      description: "event"
    }),
    [WebhookEventTypeEnum.PAYMENT_VOID]: intl.formatMessage({
      id: "EeAaOf",
      defaultMessage: "Void payment",
      description: "event"
    }),
    [WebhookEventTypeEnum.PRODUCT_CREATED]: intl.formatMessage({
      id: "U3yQDc",
      defaultMessage: "Product created",
      description: "event"
    }),
    [WebhookEventTypeEnum.PRODUCT_UPDATED]: intl.formatMessage({
      id: "nivwwr",
      defaultMessage: "Product updated",
      description: "event"
    }),
    [WebhookEventTypeEnum.PRODUCT_DELETED]: intl.formatMessage({
      id: "Na8m6z",
      defaultMessage: "Product deleted",
      description: "event"
    }),
    [WebhookEventTypeEnum.PRODUCT_VARIANT_BACK_IN_STOCK]: intl.formatMessage({
      id: "HdzwSR",
      defaultMessage: "Product variant back in stock",
      description: "event"
    }),
    [WebhookEventTypeEnum.PRODUCT_VARIANT_OUT_OF_STOCK]: intl.formatMessage({
      id: "bjEFqI",
      defaultMessage: "Product variant out of stock",
      description: "event"
    }),
    [WebhookEventTypeEnum.PRODUCT_VARIANT_CREATED]: intl.formatMessage({
      id: "yQ9l8W",
      defaultMessage: "Product variant created",
      description: "event"
    }),
    [WebhookEventTypeEnum.PRODUCT_VARIANT_UPDATED]: intl.formatMessage({
      id: "DOOZtY",
      defaultMessage: "Product variant updated",
      description: "event"
    }),
    [WebhookEventTypeEnum.PRODUCT_VARIANT_DELETED]: intl.formatMessage({
      id: "f4Mbwk",
      defaultMessage: "Product variant deleted",
      description: "event"
    }),
    [WebhookEventTypeEnum.PRODUCT_VARIANT_BACK_IN_STOCK]: intl.formatMessage({
      id: "HdzwSR",
      defaultMessage: "Product variant back in stock",
      description: "event"
    }),
    [WebhookEventTypeEnum.PRODUCT_VARIANT_OUT_OF_STOCK]: intl.formatMessage({
      id: "bjEFqI",
      defaultMessage: "Product variant out of stock",
      description: "event"
    }),
    [WebhookEventTypeEnum.FULFILLMENT_CANCELED]: intl.formatMessage({
      id: "vJq9ZL",
      defaultMessage: "Fulfillment canceled",
      description: "event"
    }),
    [WebhookEventTypeEnum.FULFILLMENT_CREATED]: intl.formatMessage({
      id: "oiiM3u",
      defaultMessage: "Fulfillment created",
      description: "event"
    }),
    [WebhookEventTypeEnum.FULFILLMENT_CANCELED]: intl.formatMessage({
      id: "vJq9ZL",
      defaultMessage: "Fulfillment canceled",
      description: "event"
    }),
    [WebhookEventTypeEnum.INVOICE_REQUESTED]: intl.formatMessage({
      id: "0IUAIK",
      defaultMessage: "Invoice requested",
      description: "event"
    }),
    [WebhookEventTypeEnum.INVOICE_SENT]: intl.formatMessage({
      id: "z1tTCq",
      defaultMessage: "Invoice sent",
      description: "event"
    }),
    [WebhookEventTypeEnum.INVOICE_DELETED]: intl.formatMessage({
      id: "Q8W5Fk",
      defaultMessage: "Invoice deleted",
      description: "event"
    }),
    [WebhookEventTypeEnum.PAGE_CREATED]: intl.formatMessage({
      id: "tjAWvw",
      defaultMessage: "Page created",
      description: "event"
    }),
    [WebhookEventTypeEnum.PAGE_UPDATED]: intl.formatMessage({
      id: "ovRcH7",
      defaultMessage: "Page updated",
      description: "event"
    }),
    [WebhookEventTypeEnum.PAGE_DELETED]: intl.formatMessage({
      id: "8PYN4w",
      defaultMessage: "Page deleted",
      description: "event"
    }),
    [WebhookEventTypeEnum.NOTIFY_USER]: intl.formatMessage({
      id: "XPOSOs",
      defaultMessage: "User notified",
      description: "event"
    }),
    [WebhookEventTypeEnum.TRANSLATION_CREATED]: intl.formatMessage({
      id: "fWu6k3",
      defaultMessage: "Translation created",
      description: "event"
    }),
    [WebhookEventTypeEnum.TRANSLATION_UPDATED]: intl.formatMessage({
      id: "ywbAO1",
      defaultMessage: "Translation updated",
      description: "event"
    }),
    [WebhookEventTypeEnum.FULFILLMENT_CANCELED]: intl.formatMessage({
      id: "ywbAO1",
      defaultMessage: "Translation updated",
      description: "event"
    })
  };

  const handleEventsChange = (event: ChangeEvent) =>
    onChange({
      target: {
        name: "events",
        value: toggle(event.target.name, data.events, (a, b) => a === b)
      }
    });

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "GLewww",
          defaultMessage: "Events",
          description: "section header"
        })}
      />
      <CardContent>
        <Typography>
          {intl.formatMessage({
            id: "FMBNP2",
            defaultMessage:
              "Expand or restrict webhooks permissions to register certain events in Saleor system.",
            description: "webhook events"
          })}
        </Typography>
        <ControlledCheckbox
          checked={data.allEvents}
          disabled={disabled}
          label={translatedEvents.ANY_EVENTS}
          name="allEvents"
          onChange={onChange}
        />
        {!data.allEvents && (
          <>
            <Hr />
            {eventsEnum.slice(1).map(event => (
              <div key={event}>
                <ControlledCheckbox
                  checked={data.events.includes(event)}
                  disabled={disabled}
                  label={translatedEvents[event]}
                  name={event}
                  onChange={handleEventsChange}
                />
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};
WebhookEvents.displayName = "WebhookEvents";
export default WebhookEvents;
