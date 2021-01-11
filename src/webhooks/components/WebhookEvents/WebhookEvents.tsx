import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
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
      defaultMessage: "All events",
      description: "event"
    }),
    [WebhookEventTypeEnum.CHECKOUT_CREATED]: intl.formatMessage({
      defaultMessage: "Checkout created",
      description: "event"
    }),
    [WebhookEventTypeEnum.CHECKOUT_UPDATED]: intl.formatMessage({
      defaultMessage: "Checkout updated",
      description: "event"
    }),
    [WebhookEventTypeEnum.CUSTOMER_CREATED]: intl.formatMessage({
      defaultMessage: "Customer created",
      description: "event"
    }),
    [WebhookEventTypeEnum.ORDER_CANCELLED]: intl.formatMessage({
      defaultMessage: "Order cancelled",
      description: "event"
    }),
    [WebhookEventTypeEnum.ORDER_CREATED]: intl.formatMessage({
      defaultMessage: "Order created",
      description: "event"
    }),
    [WebhookEventTypeEnum.ORDER_FULFILLED]: intl.formatMessage({
      defaultMessage: "Order fulfilled",
      description: "event"
    }),
    [WebhookEventTypeEnum.ORDER_FULLY_PAID]: intl.formatMessage({
      defaultMessage: "Order fully paid",
      description: "event"
    }),
    [WebhookEventTypeEnum.ORDER_UPDATED]: intl.formatMessage({
      defaultMessage: "Order updated",
      description: "event"
    }),
    [WebhookEventTypeEnum.PRODUCT_CREATED]: intl.formatMessage({
      defaultMessage: "Product created",
      description: "event"
    }),
    [WebhookEventTypeEnum.PRODUCT_UPDATED]: intl.formatMessage({
      defaultMessage: "Product updated",
      description: "event"
    }),
    [WebhookEventTypeEnum.CHECKOUT_QUANTITY_CHANGED]: intl.formatMessage({
      defaultMessage: "Changed quantity in checkout",
      description: "event"
    }),
    [WebhookEventTypeEnum.FULFILLMENT_CREATED]: intl.formatMessage({
      defaultMessage: "Fulfillment created",
      description: "event"
    }),
    [WebhookEventTypeEnum.INVOICE_REQUESTED]: intl.formatMessage({
      defaultMessage: "Invoice requested",
      description: "event"
    }),
    [WebhookEventTypeEnum.INVOICE_SENT]: intl.formatMessage({
      defaultMessage: "Invoice sent",
      description: "event"
    }),
    [WebhookEventTypeEnum.INVOICE_DELETED]: intl.formatMessage({
      defaultMessage: "Invoice deleted",
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
          defaultMessage: "Events",
          description: "section header"
        })}
      />
      <CardContent>
        <Typography>
          {intl.formatMessage({
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
