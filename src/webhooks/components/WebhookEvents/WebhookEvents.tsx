import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/styles/makeStyles";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import React from "react";
import { useIntl } from "react-intl";
import { WebhookEventTypeEnum } from "../../../types/globalTypes";
import { FormData } from "../WebhooksDetailsPage";

interface WebhookEventsProps {
  data: FormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(() => ({
  item: {
    paddingBottom: 10,
    paddingTop: 10
  }
}));

const WebhookEvents: React.StatelessComponent<WebhookEventsProps> = ({
  data,
  disabled,
  onChange
}) => {
  const intl = useIntl();
  const [events, setEvents] = React.useState();

  const eventsEnum = Object.values(WebhookEventTypeEnum);

  const addOrRemove = (array, value) => {
    const index = array.indexOf(value);

    if (index === -1) {
      array.push(value);
    } else {
      array.splice(index, 1);
    }
  };

  const eventsOnChange = event => {
    const newData = [events];
    addOrRemove(newData, event.name);
    setEvents(newData);
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
        {eventsEnum.map((event, index) => (
          <div key={index}>
            <ControlledCheckbox
              name={event}
              label={event}
              checked={data.events[event]}
              onChange={eventsOnChange}
              disabled={disabled}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
WebhookEvents.displayName = "WebhookEvents";
export default WebhookEvents;
