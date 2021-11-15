import {
  Card,
  List,
  ListItem,
  ListItemText,
  Typography
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { DateTime } from "@saleor/components/Date";
import Skeleton from "@saleor/components/Skeleton";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";
import { Home_activities_edges_node } from "../../types/Home";
import { getActivityMessage } from "./activityMessages";

const useStyles = makeStyles(
  {
    loadingProducts: {
      paddingBottom: "10px",
      paddingTop: "10px"
    },
    noProducts: {
      paddingBottom: "16px",
      paddingTop: "16px"
    }
  },
  { name: "HomeActivityCard" }
);

interface HomeActivityCardProps {
  activities: Home_activities_edges_node[];
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
          defaultMessage: "Activity",
          description: "header",
          id: "homeActivityCardHeader"
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
                      defaultMessage="No activities found"
                      id="homeActivityCardNoActivities"
                    />
                  </Typography>
                }
              />
            </ListItem>
          )
        )}
      </List>
    </Card>
  );
};
HomeActivityCard.displayName = "HomeActivityCard";
export default HomeActivityCard;
