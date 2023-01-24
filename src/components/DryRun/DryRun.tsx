import Grid from "@dashboard/components/Grid";
import { AsyncWebhookTypes } from "@dashboard/custom-apps/components/WebhookEvents";
import { useStyles } from "@dashboard/custom-apps/components/WebhookEvents/styles";
import {
  useTriggerWebhookDryRunMutation,
  WebhookEventTypeAsyncEnum,
} from "@dashboard/graphql";
import {
  capitalize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from "@material-ui/core";
import {
  Alert,
  Button,
  DialogHeader,
  List,
  ListBody,
  ListHeader,
  ListItem,
  ListItemCell,
} from "@saleor/macaw-ui";
import { InlineFragmentNode, ObjectFieldNode, parse, visit } from "graphql";
import uniq from "lodash/uniq";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import {
  DryRunItemsList,
  ExcludedDocumentMap,
} from "../DryRunItemsList/DryRunItemsList";
import { messages } from "./messages";

interface DryRunProps {
  query: string;
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  asyncEvents: WebhookEventTypeAsyncEnum[];
  setResult: React.Dispatch<React.SetStateAction<string>>;
}

export const DryRun = (props: DryRunProps) => {
  const { query, showDialog, setShowDialog } = props;
  const classes = useStyles();
  const [objectId, setObjectId] = useState(null);
  const [triggerWebhookDryRun] = useTriggerWebhookDryRunMutation();
  const queryEvents = getEventsFromQuery(query);
  const availableObjects = uniq(
    queryEvents.map(event => {
      const object = event.split(/(?=[A-Z])/).slice(0, -1);
      if (
        Object.keys(AsyncWebhookTypes)
          .filter(
            object =>
              !Object.keys(ExcludedDocumentMap).includes(object.toUpperCase()),
          )
          .includes(object.join("_").toUpperCase())
      ) {
        return object.join(" ");
      }

      return event
        .split(/(?=[A-Z])/)
        .slice(0, -2)
        .join(" ");
    }),
  ).filter(object => object.length > 0);

  const unavailableObjects = uniq(
    queryEvents.map(event => {
      const object = event.split(/(?=[A-Z])/).slice(0, -1);
      if (
        Object.keys(AsyncWebhookTypes)
          .filter(object =>
            Object.keys(ExcludedDocumentMap).includes(object.toUpperCase()),
          )
          .includes(object.join("_").toUpperCase())
      ) {
        return object.join(" ");
      }

      return event
        .split(/(?=[A-Z])/)
        .slice(0, -2)
        .join(" ");
    }),
  ).filter(object => object.length > 0);

  const [object, setObject] = useState(null);

  const dryRun = async () => {
    const { data } = await triggerWebhookDryRun({
      variables: { objectId, query },
    });
    props.setResult(
      JSON.stringify(JSON.parse(data.webhookDryRun.payload), null, 2),
    );
    closeDialog();
  };

  const closeDialog = () => {
    setShowDialog(false);
    setObjectId(null);
    setObject(null);
    props.setShowDialog(false);
  };

  if (!showDialog) {
    return <></>;
  }

  return (
    <Dialog open={showDialog} fullWidth maxWidth="md">
      <DialogHeader onClose={closeDialog}>
        <FormattedMessage {...messages.header} />
      </DialogHeader>
      <DialogContent style={{ overflow: "scroll" }}>
        <DialogContentText>
          <FormattedMessage {...messages.selectObject} />
        </DialogContentText>

        {unavailableObjects.length && (
          <Alert variant="warning" close={false}>
            <Typography>
              <FormattedMessage {...messages.unavailableObjects} />
              &nbsp;
              <strong>{unavailableObjects.join(", ")}</strong>
            </Typography>
          </Alert>
        )}

        <Grid variant="uniform">
          <div className={classes.objectsWrapper}>
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
                {!availableObjects.length && (
                  <Typography>
                    <FormattedMessage {...messages.noObjects} />
                  </Typography>
                )}
                {availableObjects.map((object, idx) => (
                  <ListItem
                    key={idx}
                    className={classes.listItem}
                    onClick={() =>
                      setObject(object.split(" ").join("_").toUpperCase())
                    }
                  >
                    <ListItemCell className={classes.listItemCell}>
                      <strong>
                        {capitalize(object.replaceAll("_", " ").toLowerCase())}
                      </strong>
                    </ListItemCell>
                    <ListItemCell></ListItemCell>
                  </ListItem>
                ))}
              </ListBody>
            </List>
          </div>
          <div className={classes.eventsWrapper}>
            {object ? (
              <DryRunItemsList
                setObjectId={setObjectId}
                objectId={objectId}
                object={object}
              />
            ) : (
              <>
                <ListHeader>
                  <ListItem className={classes.listHeader}>
                    <ListItemCell className={classes.listItemCell}>
                      <FormattedMessage {...messages.item} />
                    </ListItemCell>
                  </ListItem>
                </ListHeader>
                <ListBody className={classes.listBody}>
                  <Typography>
                    <FormattedMessage {...messages.itemsDefaultMessage} />
                  </Typography>
                </ListBody>
              </>
            )}
          </div>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="primary"
          onClick={() => dryRun()}
          disabled={!availableObjects.length}
        >
          <FormattedMessage {...messages.run} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const getEventsFromQuery = (query: string) => {
  if (query.length === 0) {
    return [];
  }

  try {
    const ast = parse(query);
    const events: string[] = [];

    visit(ast, {
      SelectionSet(node, _key, parent) {
        if ((parent as ObjectFieldNode).name?.value === "event") {
          const queryEvents = node.selections.map(
            selection =>
              (selection as InlineFragmentNode).typeCondition.name.value,
          );

          queryEvents.map(event => events.push(event));
        }
      },
    });

    return events;
  } catch {
    return [];
  }
};

export default DryRun;
