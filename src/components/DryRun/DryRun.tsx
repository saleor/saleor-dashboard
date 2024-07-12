// @ts-strict-ignore
import Grid from "@dashboard/components/Grid";
import { useStyles } from "@dashboard/custom-apps/components/WebhookEvents/styles";
import { useTriggerWebhookDryRunMutation, WebhookEventTypeSyncEnum } from "@dashboard/graphql";
import {
  capitalize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import { Text } from "@saleor/macaw-ui-next";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useIntl } from "react-intl";

import DryRunItemsList from "../DryRunItemsList/DryRunItemsList";
import { DocumentMap } from "../DryRunItemsList/utils";
import { messages } from "./messages";
import { getUnavailableObjects } from "./utils";

interface DryRunProps {
  query: string;
  showDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  setResult: Dispatch<SetStateAction<string>>;
  syncEvents: WebhookEventTypeSyncEnum[];
}

const DryRun: React.FC<DryRunProps> = ({
  setResult,
  showDialog,
  setShowDialog,
  query,
  syncEvents,
}: DryRunProps) => {
  const intl = useIntl();
  const classes = useStyles({});
  const [objectId, setObjectId] = useState<string | null>(null);
  const [triggerWebhookDryRun] = useTriggerWebhookDryRunMutation();
  const availableObjects = Object.keys(DocumentMap).map(object =>
    capitalize(object.split("_").join(" ").toLowerCase()),
  );
  const unavailableObjects = getUnavailableObjects(query);
  const [object, setObject] = useState<string | null>(null);
  const dryRun = async () => {
    const { data } = await triggerWebhookDryRun({
      variables: { objectId, query },
    });

    setResult(JSON.stringify(JSON.parse(data.webhookDryRun.payload), null, 2));
    closeDialog();
  };
  const closeDialog = () => {
    setShowDialog(false);
    setObjectId(null);
    setObject(null);
    setShowDialog(false);
  };

  if (!showDialog) {
    return <></>;
  }

  if (syncEvents.length > 0) {
    return (
      <Dialog open={showDialog} fullWidth maxWidth="md" data-test-id="dry-run">
        <DialogHeader onClose={closeDialog}>{intl.formatMessage(messages.header)}</DialogHeader>
        <DialogContent style={{ overflow: "scroll" }}>
          <Alert variant="error" close={false}>
            <Text>{intl.formatMessage(messages.unavailableSyncEvents)}</Text>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={showDialog} fullWidth maxWidth="md" data-test-id="dry-run">
      <DialogHeader onClose={closeDialog}>{intl.formatMessage(messages.header)}</DialogHeader>
      <DialogContent style={{ overflow: "scroll" }}>
        <DialogContentText>{intl.formatMessage(messages.selectObject)}</DialogContentText>

        {!!unavailableObjects.length && (
          <Alert variant="warning" close={false} className="remove-icon-background">
            <Text>
              {intl.formatMessage(messages.unavailableEvents)}
              <br />
              <strong>{unavailableObjects.join(", ")}</strong>
            </Text>
          </Alert>
        )}

        <Grid variant="uniform">
          <div className={classes.objectsWrapper}>
            <List gridTemplate={["1fr 50px"]}>
              <ListHeader>
                <ListItem className={classes.listHeader}>
                  <ListItemCell className={classes.listItemCell}>
                    {intl.formatMessage(messages.objects)}
                  </ListItemCell>
                  <ListItemCell></ListItemCell>
                </ListItem>
              </ListHeader>
              <ListBody className={classes.listBody}>
                {!availableObjects.length && <Text>{intl.formatMessage(messages.noObjects)}</Text>}
                {availableObjects.map((object, idx) => (
                  <ListItem
                    key={idx}
                    className={classes.listItem}
                    onClick={() => setObject(object.split(" ").join("_").toUpperCase())}
                  >
                    <ListItemCell className={classes.listItemCell}>
                      <strong>{capitalize(object.replaceAll("_", " ").toLowerCase())}</strong>
                    </ListItemCell>
                    <ListItemCell></ListItemCell>
                  </ListItem>
                ))}
              </ListBody>
            </List>
          </div>
          <div className={classes.eventsWrapper}>
            {object ? (
              <DryRunItemsList setObjectId={setObjectId} objectId={objectId} object={object} />
            ) : (
              <>
                <ListHeader>
                  <ListItem className={classes.listHeader}>
                    <ListItemCell className={classes.listItemCell}>
                      {intl.formatMessage(messages.item)}
                    </ListItemCell>
                  </ListItem>
                </ListHeader>
                <ListBody className={classes.listBody}>
                  <Text>{intl.formatMessage(messages.itemsDefaultMessage)}</Text>
                </ListBody>
              </>
            )}
          </div>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="primary" onClick={dryRun} disabled={!object}>
          {intl.formatMessage(messages.run)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DryRun.displayName = "DryRun";
export default DryRun;
