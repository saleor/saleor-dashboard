import Grid from "@dashboard/components/Grid";
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
import React, { Dispatch, SetStateAction, useState } from "react";
import { useIntl } from "react-intl";

import DryRunItemsList from "../DryRunItemsList/DryRunItemsList";
import { messages } from "./messages";
import { getObjects } from "./utils";

interface DryRunProps {
  query: string;
  showDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  asyncEvents: WebhookEventTypeAsyncEnum[];
  setResult: Dispatch<SetStateAction<string>>;
}

export const DryRun: React.FC<DryRunProps> = ({
  setResult,
  showDialog,
  setShowDialog,
  query,
}: DryRunProps) => {
  const intl = useIntl();
  const classes = useStyles();
  const [objectId, setObjectId] = useState<string | null>(null);
  const [triggerWebhookDryRun] = useTriggerWebhookDryRunMutation();
  const availableObjects = getObjects(query);
  const unavailableObjects = getObjects(query, false);

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

  return (
    <Dialog open={showDialog} fullWidth maxWidth="md" data-test-id="dry-run">
      <DialogHeader onClose={closeDialog}>
        {intl.formatMessage(messages.header)}
      </DialogHeader>
      <DialogContent style={{ overflow: "scroll" }}>
        <DialogContentText>
          {intl.formatMessage(messages.selectObject)}
        </DialogContentText>

        {!!unavailableObjects.length && (
          <Alert variant="warning" close={false}>
            <Typography>
              {intl.formatMessage(messages.unavailableObjects)}
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
                    {intl.formatMessage(messages.objects)}
                  </ListItemCell>
                  <ListItemCell></ListItemCell>
                </ListItem>
              </ListHeader>
              <ListBody className={classes.listBody}>
                {!availableObjects.length && (
                  <Typography>
                    {intl.formatMessage(messages.noObjects)}
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
                      {intl.formatMessage(messages.item)}
                    </ListItemCell>
                  </ListItem>
                </ListHeader>
                <ListBody className={classes.listBody}>
                  <Typography>
                    {intl.formatMessage(messages.itemsDefaultMessage)}
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
          onClick={dryRun}
          disabled={!availableObjects.length}
        >
          {intl.formatMessage(messages.run)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DryRun.displayName = "DryRun";
export default DryRun;
