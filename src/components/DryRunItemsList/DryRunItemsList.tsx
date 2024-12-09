// @ts-strict-ignore

import { useStyles } from "@dashboard/custom-apps/components/WebhookEvents/styles";
import { useQuery } from "@dashboard/hooks/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Radio } from "@material-ui/core";
import {
  List,
  ListBody,
  ListHeader,
  ListItem,
  ListItemCell,
  useListWidths,
} from "@saleor/macaw-ui";
import { Skeleton } from "@saleor/macaw-ui-next";
import camelCase from "lodash/camelCase";
import * as React from "react";
import { useIntl } from "react-intl";

import Avatar from "../TableCellAvatar/Avatar";
import { messages } from "./messages";
import { DocumentMap, TData, TVariables } from "./utils";

export interface DryRunItemsListProps {
  objectId: string;
  setObjectId: React.Dispatch<any>;
  object: string;
}

const DryRunItemsList = ({ object, objectId, setObjectId }: DryRunItemsListProps) => {
  const intl = useIntl();
  const classes = useStyles({});
  const { checkbox } = useListWidths();
  const objectDocument = DocumentMap[object];
  const objectCollection = objectDocument.collection ?? camelCase(`${object.toLowerCase()}s`);
  const { data, loading } = useQuery<TData, TVariables>(objectDocument.document, {
    displayLoader: true,
    variables: objectDocument.variables,
  });

  return (
    <List gridTemplate={["1fr", checkbox, checkbox]} data-test-id="dry-run-items-list">
      <ListHeader>
        <ListItem className={classes.listHeader}>
          <ListItemCell className={classes.listItemCell}>
            {intl.formatMessage(messages.item)}
            &nbsp;
            {objectDocument.collection
              ?.split(/(?=[A-Z])/)
              .map(item => item.toLowerCase())
              .join(" ")}
            &nbsp;
            {objectDocument.displayedAttribute}
          </ListItemCell>
        </ListItem>
      </ListHeader>
      <ListBody className={classes.listBody}>
        {loading ? (
          <ListItem className={classes.listItem}>
            <ListItemCell className={classes.listItemCell}>
              <Skeleton />
            </ListItemCell>
            <ListItemCell>
              <Skeleton />
            </ListItemCell>
            <ListItemCell>
              <Skeleton />
            </ListItemCell>
          </ListItem>
        ) : (
          (mapEdgesToItems<any>(data[objectCollection]) || []).map((item, idx) => (
            <ListItem className={classes.listItem} key={idx} onClick={() => setObjectId(item.id)}>
              <ListItemCell className={classes.listItemCell}>
                {item.name || item[objectDocument.displayedAttribute] || item.id || item.__typename}
              </ListItemCell>
              <ListItemCell>
                {item.thumbnail && <Avatar thumbnail={item.thumbnail?.url} />}
              </ListItemCell>
              <ListItemCell>
                <Radio checked={item.id === objectId} />
              </ListItemCell>
            </ListItem>
          ))
        )}
      </ListBody>
    </List>
  );
};

DryRunItemsList.displayName = "DryRunItemsList";
export default DryRunItemsList;
