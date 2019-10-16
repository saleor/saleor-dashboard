import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Hr from "@saleor/components/Hr";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { translatedWebhookEvents } from "@saleor/misc";
import { WebhookEventTypeEnum } from "@saleor/types/globalTypes";
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

const WebhookEvents: React.StatelessComponent<WebhookEventsProps> = ({
  data,
  disabled,
  onChange
}) => {
  const intl = useIntl();
  const eventsEnum = Object.values(WebhookEventTypeEnum);
  const translatedEvents = translatedWebhookEvents(intl);

  const handleAllEventsChange = (event: ChangeEvent) =>
    onChange(event, () =>
      onChange({
        target: {
          name: "events",
          value: event.target.value ? WebhookEventTypeEnum.ANY_EVENTS : []
        }
      } as any)
    );

  const handleEventsChange = (event: ChangeEvent) => {
    onChange({
      target: {
        name: "events",
        value: event.target.value
          ? data.events.concat([event.target.name])
          : data.events.filter(events => events !== event.target.name)
      }
    } as any);
  };

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
          onChange={handleAllEventsChange}
        />
        {!data.allEvents && (
          <>
            <Hr />
            {eventsEnum.slice(1).map(event => {
              return (
                <div key={event}>
                  <ControlledCheckbox
                    checked={data.events.includes(event)}
                    disabled={disabled}
                    label={translatedEvents[event]}
                    name={event}
                    onChange={handleEventsChange}
                  />
                </div>
              );
            })}
          </>
        )}
      </CardContent>
    </Card>
  );
};
WebhookEvents.displayName = "WebhookEvents";
export default WebhookEvents;
