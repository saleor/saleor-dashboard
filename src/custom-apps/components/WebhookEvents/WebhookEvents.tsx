import Grid from "@dashboard/components/Grid";
import Hr from "@dashboard/components/Hr";
import {
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { capitalize } from "@dashboard/misc";
import { Card, CardContent, Checkbox, Typography } from "@material-ui/core";
import {
  List,
  ListHeader,
  ListItem,
  ListItemCell,
  PageTab,
  PageTabPanel,
  PageTabs,
  Pill,
  useListWidths,
} from "@saleor/macaw-ui";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

interface WebhookEventsProps {
  data: {
    syncEvents: WebhookEventTypeSyncEnum[];
    asyncEvents: WebhookEventTypeAsyncEnum[];
  };
  onSyncEventChange: (event: ChangeEvent) => void;
  onAsyncEventChange: (event: ChangeEvent) => void;
}

const WebhookEvents: React.FC<WebhookEventsProps> = ({
  data,
  onSyncEventChange,
  onAsyncEventChange,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const { checkbox } = useListWidths();

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
    setTab(value);
  };

  const countEvents = object => {
    const selected = tab === "sync" ? data.syncEvents : data.asyncEvents;
    const objectEvents = EventTypes[tab][object].map(
      event => `${object}_${event}`,
    );

    return objectEvents.filter((event: never) => selected.includes(event))
      .length;
  };

  return (
    <>
      <Card>
        <CardContent>
          <PageTabs value={tab} onChange={handleTabChange}>
            <PageTab
              label={intl.formatMessage(messages.asynchronous)}
              value="async"
            />
            <PageTab
              label={intl.formatMessage(messages.synchronous)}
              value="sync"
            />
          </PageTabs>

          <Typography variant="subtitle2" style={{ padding: "1rem 0" }}>
            <PageTabPanel show={tab === "sync"}>
              <FormattedMessage {...messages.synchronousDescription} />
            </PageTabPanel>
            <PageTabPanel show={tab === "async"}>
              <FormattedMessage {...messages.asynchronousDescription} />
            </PageTabPanel>
          </Typography>
        </CardContent>
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
                <div className={classes.listItems}>
                  {Object.keys(EventTypes[tab]).map((object, idx) => (
                    <ListItem
                      key={idx}
                      className={classes.listItem}
                      onClick={() => setObject(object)}
                    >
                      <ListItemCell className={classes.listItemCell}>
                        <strong>
                          {capitalize(
                            object.replaceAll("_", " ").toLowerCase(),
                          )}
                        </strong>
                      </ListItemCell>
                      <ListItemCell>
                        {countEvents(object) > 0 && (
                          <Pill
                            size="small"
                            color="error"
                            label={countEvents(object)}
                          />
                        )}
                      </ListItemCell>
                    </ListItem>
                  ))}
                </div>
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
              {object &&
                EventTypes[tab][object] &&
                EventTypes[tab][object].map((event, idx) => (
                  <ListItem className={classes.listItem} key={idx}>
                    <ListItemCell className={classes.listItemCell}>
                      <strong>
                        {capitalize(event.toLowerCase().replaceAll("_", " "))}
                      </strong>
                    </ListItemCell>
                    <ListItemCell>
                      <Checkbox
                        name={`${tab}Events`}
                        checked={data[`${tab}Events`].includes(
                          getEventName(object, event),
                        )}
                        value={getEventName(object, event)}
                        onChange={handleEventChange}
                        className={classes.checkbox}
                      />
                    </ListItemCell>
                  </ListItem>
                ))}
            </List>
          </div>
        </Grid>
      </Card>
    </>
  );
};
WebhookEvents.displayName = "WebhookEvents";
export default WebhookEvents;

type Actions = string[];

const AsyncWebhookTypes: Record<string, Actions> = {
  ADDRESS: ["CREATED", "UPDATED", "DELETED"],
  APP: ["INSTALLED", "UPDATED", "DELETED"],
  ATTRIBUTE: ["CREATED", "UPDATED", "DELETED"],
  CATEGORY: ["CREATED", "UPDATED", "DELETED"],
  CHANNEL: ["CREATED", "UPDATED", "DELETED"],
  GIFT_CARD: ["CREATED", "UPDATED", "DELETED", "STATUS_CHANGED"],

  CHECKOUT: ["CREATED", "UPDATED", "DELETED"],
  COLLECTION: ["CREATED", "UPDATED", "DELETED"],
  CUSTOMER: ["CREATED", "UPDATED", "DELETED"],
  FULFILLMENT: ["CREATED"],
  INVOICE: ["DELETED", "REQUESTED", "SENT"],
  MENU: ["CREATED", "UPDATED", "DELETED"],
  ORDER: [
    "CANCELLED",
    "CONFIRMED",
    "CREATED",
    "FULFILLED",
    "FULLY_PAID",
    "UPDATED",
  ],
  PAGE: ["CREATED", "UPDATED", "DELETED"],
  PRODUCT: ["CREATED", "UPDATED", "DELETED"],
  PRODUCT_VARIANT: ["CREATED", "UPDATED", "DELETED"],
  SALE: ["CREATED", "UPDATED", "DELETED", "TOGGLE"],
  SHIPPING_PRICE: ["CREATED", "UPDATED", "DELETED"],
  SHIPPING_ZONE: ["CREATED", "UPDATED", "DELETED"],
  STAFF: ["CREATED", "UPDATED", "DELETED"],
  TRANSLATION: ["ACTION_REQUEST", "CREATED", "UPDATED"],
  VOUCHER: ["CREATED", "UPDATED", "DELETED"],
  WAREHOUSE: ["CREATED", "UPDATED", "DELETED"],
};

const SyncWebhookTypes: Record<string, Actions> = {
  PAYMENT: [
    "AUTHORIZE",
    "CAPTURE",
    "CONFIRM",
    "LIST_GATEWAYS",
    "PROCESS",
    "REFUND",
    "VOID",
  ],
  CHECKOUT: ["CALCULATE_TAXES", "FILTER_SHIPPING_METHODS"],
  ORDER: ["CALCULATE_TAXES", "FILTER_SHIPPING_METHODS"],
  SHIPPING: ["LIST_METHODS_FOR_CHECKOUT"],
};

const EventTypes = {
  async: AsyncWebhookTypes,
  sync: SyncWebhookTypes,
};

const getEventName = (object: string, event: string) =>
  [object, event].join("_").toUpperCase() as WebhookEventTypeSyncEnum;
