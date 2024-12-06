// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import Grid from "@dashboard/components/Grid";
import Hr from "@dashboard/components/Hr";
import { Pill } from "@dashboard/components/Pill";
import { WebhookEventTypeAsyncEnum, WebhookEventTypeSyncEnum } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { capitalize } from "@dashboard/misc";
import { Checkbox } from "@material-ui/core";
import {
  List,
  ListBody,
  ListHeader,
  ListItem,
  ListItemCell,
  PageTab,
  PageTabPanel,
  PageTabs,
  useListWidths,
} from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import { Dispatch, SetStateAction, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";
import { EventTypes, getEventName } from "./utils";

interface WebhookEventsProps {
  data: {
    syncEvents: WebhookEventTypeSyncEnum[];
    asyncEvents: WebhookEventTypeAsyncEnum[];
  };
  setQuery: Dispatch<SetStateAction<string>>;
  onSyncEventChange: (event: ChangeEvent) => void;
  onAsyncEventChange: (event: ChangeEvent) => void;
}

const WebhookEvents = ({
  data,
  setQuery,
  onSyncEventChange,
  onAsyncEventChange,
}: WebhookEventsProps) => {
  const intl = useIntl();
  const { checkbox } = useListWidths();
  const classes = useStyles({ checkbox });
  const [tab, setTab] = useState("async");
  const [object, setObject] = useState<string | null>(null);
  const handleEventChange = event => {
    if (tab === "sync") {
      return onSyncEventChange(event);
    }

    return onAsyncEventChange(event);
  };
  const handleTabChange = value => {
    setObject(null);
    setQuery("");
    setTab(value);
  };
  const countEvents = object => {
    const selected = tab === "sync" ? data.syncEvents : data.asyncEvents;
    const objectEvents = EventTypes[tab][object].map(event => {
      if (event === object) {
        return object;
      }

      return `${object}_${event}`;
    });

    return objectEvents.filter((event: never) => selected.includes(event)).length;
  };

  return (
    <>
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title>{intl.formatMessage(messages.webhookEvents)}</DashboardCard.Title>
        </DashboardCard.Header>
        <DashboardCard.Content className={classes.cardHeader}>
          <PageTabs value={tab} onChange={handleTabChange}>
            <PageTab label={intl.formatMessage(messages.asynchronous)} value="async" />
            <PageTab label={intl.formatMessage(messages.synchronous)} value="sync" />
          </PageTabs>

          <Text fontSize={2} style={{ padding: "1rem 0" }}>
            <PageTabPanel show={tab === "sync"}>
              <FormattedMessage {...messages.synchronousDescription} />
            </PageTabPanel>
            <PageTabPanel show={tab === "async"}>
              <FormattedMessage {...messages.asynchronousDescription} />
            </PageTabPanel>
          </Text>
        </DashboardCard.Content>
        <Hr />
        <Grid variant="uniform">
          <div className={classes.objectsWrapper}>
            <PageTabPanel show={true}>
              <List gridTemplate={["1fr 50px"]}>
                <ListHeader>
                  <ListItem className={classes.listHeader}>
                    <ListItemCell className={classes.listItemCell}>
                      <FormattedMessage {...messages.objects} />
                    </ListItemCell>
                    <ListItemCell></ListItemCell>
                  </ListItem>
                </ListHeader>
                <ListBody className={classes.listBody}>
                  {Object.keys(EventTypes[tab]).map((object, idx) => (
                    <ListItem
                      data-test-id="webhook-objects-items"
                      key={idx}
                      className={classes.listItem}
                      onClick={() => setObject(object)}
                    >
                      <ListItemCell className={classes.listItemCell}>
                        <strong>{capitalize(object.replaceAll("_", " ").toLowerCase())}</strong>
                      </ListItemCell>
                      <ListItemCell>
                        {countEvents(object) > 0 && (
                          <Pill size="small" color="error" label={countEvents(object)} />
                        )}
                      </ListItemCell>
                    </ListItem>
                  ))}
                </ListBody>
              </List>
            </PageTabPanel>
          </div>
          <div className={classes.eventsWrapper}>
            <List gridTemplate={["1fr", checkbox]}>
              <ListHeader>
                <ListItem className={classes.listHeader}>
                  <ListItemCell className={classes.listItemCell}>
                    <FormattedMessage {...messages.events} />
                  </ListItemCell>
                </ListItem>
              </ListHeader>
              <ListBody className={classes.listBody}>
                {object &&
                  EventTypes[tab][object] &&
                  EventTypes[tab][object].map((event, idx) => (
                    <ListItem className={classes.eventListItem} key={idx}>
                      <ListItemCell className={classes.eventListItemCell}>
                        <label htmlFor={`event-checkbox-${idx}`} className={classes.eventListLabel}>
                          <strong>{capitalize(event.toLowerCase().replaceAll("_", " "))}</strong>
                          <Checkbox
                            data-test-id="events-checkbox"
                            name={`${tab}Events`}
                            checked={data[`${tab}Events`].includes(getEventName(object, event))}
                            value={getEventName(object, event)}
                            onChange={handleEventChange}
                            className={classes.checkbox}
                            id={`event-checkbox-${idx}`}
                          />
                        </label>
                      </ListItemCell>
                    </ListItem>
                  ))}
              </ListBody>
            </List>
          </div>
        </Grid>
        <Hr />
      </DashboardCard>
    </>
  );
};

WebhookEvents.displayName = "WebhookEvents";
export default WebhookEvents;
