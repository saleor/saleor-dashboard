// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import { DateTime } from "@dashboard/components/Date";
import Skeleton from "@dashboard/components/Skeleton";
import { HomeQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";
import { getActivityMessage } from "./activityMessages";

const useStyles = makeStyles(
  {
    loadingProducts: {
      paddingBottom: "10px",
      paddingTop: "10px",
    },
    noProducts: {
      paddingBottom: "16px",
      paddingTop: "16px",
    },
    listItem: {
      paddingLeft: 0,
    },
  },
  { name: "HomeActivityCard" },
);

interface HomeActivityCardProps {
  activities: RelayToFlat<HomeQuery["activities"]>;
  testId?: string;
}

const HomeActivityCard: React.FC<HomeActivityCardProps> = props => {
  const { activities, testId } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card data-test-id={testId}>
      <CardTitle
        title={intl.formatMessage({
          id: "BXkF8Z",
          defaultMessage: "Activity",
          description: "header",
        })}
      />
      <CardContent>
        <List dense>
          {renderCollection(
            activities,
            (activity, activityId) => (
              <ListItem key={activityId} className={classes.listItem}>
                {activity ? (
                  <ListItemText
                    primary={
                      <Typography>
                        {getActivityMessage(activity, intl)}
                      </Typography>
                    }
                    secondary={<DateTime date={activity.date} plain />}
                  />
                ) : (
                  <ListItemText className={classes.loadingProducts}>
                    <Typography>
                      <Skeleton />
                    </Typography>
                  </ListItemText>
                )}
              </ListItem>
            ),
            () => (
              <ListItem className={classes.noProducts}>
                <ListItemText
                  primary={
                    <Typography>
                      <FormattedMessage
                        id="wWTUrM"
                        defaultMessage="No activities found"
                      />
                    </Typography>
                  }
                />
              </ListItem>
            ),
          )}
        </List>
      </CardContent>
    </Card>
  );
};
HomeActivityCard.displayName = "HomeActivityCard";
export default HomeActivityCard;
