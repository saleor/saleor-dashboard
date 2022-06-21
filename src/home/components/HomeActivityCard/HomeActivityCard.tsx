import {
  Card,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { DateTime } from "@saleor/components/Date";
import Skeleton from "@saleor/components/Skeleton";
import { HomeQuery } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { RelayToFlat } from "@saleor/types";
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
      <List dense={true}>
        {renderCollection(
          activities,
          (activity, activityId) => (
            <ListItem key={activityId}>
              {activity ? (
                <ListItemText
                  primary={
                    <Typography>
                      {getActivityMessage(activity, intl)}
                    </Typography>
                  }
                  secondary={<DateTime date={activity.date} />}
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
    </Card>
  );
};
HomeActivityCard.displayName = "HomeActivityCard";
export default HomeActivityCard;
