import { Card, CardContent, Typography } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType,
} from "@saleor/components/MultiAutocompleteSelectField";
import {
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "@saleor/graphql";
import { ChangeEvent } from "@saleor/hooks/useForm";
import {
  mapAsyncEventsToChoices,
  mapSyncEventsToChoices,
} from "@saleor/webhooks/utils";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface WebhookEventsProps {
  data: {
    syncEvents: WebhookEventTypeSyncEnum[];
    asyncEvents: WebhookEventTypeAsyncEnum[];
  };
  syncEventsChoices: MultiAutocompleteChoiceType[];
  asyncEventsChoices: MultiAutocompleteChoiceType[];
  onSyncEventChange: (event: ChangeEvent) => void;
  onAsyncEventChange: (event: ChangeEvent) => void;
}

const WebhookEvents: React.FC<WebhookEventsProps> = ({
  data,
  syncEventsChoices,
  asyncEventsChoices,
  onSyncEventChange,
  onAsyncEventChange,
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.events)} />
      <CardContent>
        <Typography variant="caption">
          <FormattedMessage {...messages.synchronousEvents} />
        </Typography>
        <VerticalSpacer />
        <Typography variant="body1">
          <FormattedMessage
            {...messages.assignPermissionsToSynchronousEvents}
          />
        </Typography>
        <VerticalSpacer />
        <MultiAutocompleteSelectField
          displayValues={mapSyncEventsToChoices(data.syncEvents)}
          label={intl.formatMessage(messages.registeredEvents)}
          choices={syncEventsChoices}
          name="syncEvents"
          value={data.syncEvents}
          onChange={onSyncEventChange}
          data-test="syncEvents"
          testId="syncEvent"
        />
        <VerticalSpacer spacing={2} />
        <Hr />
        <VerticalSpacer spacing={2} />
        <Typography variant="caption">
          <FormattedMessage {...messages.asynchronousEvents} />
        </Typography>
        <VerticalSpacer />
        <Typography variant="body1">
          <FormattedMessage
            {...messages.assignPermissionsToAsynchronousEvents}
          />
        </Typography>
        <VerticalSpacer />
        <MultiAutocompleteSelectField
          displayValues={mapAsyncEventsToChoices(
            data.asyncEvents,
            data.asyncEvents,
          )}
          label={intl.formatMessage(messages.registeredEvents)}
          choices={asyncEventsChoices}
          name="asyncEvents"
          value={data.asyncEvents}
          onChange={onAsyncEventChange}
          data-test="asyncEvents"
          testId="asyncEvent"
        />
      </CardContent>
    </Card>
  );
};
WebhookEvents.displayName = "WebhookEvents";
export default WebhookEvents;
