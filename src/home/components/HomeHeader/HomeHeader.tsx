import { Typography } from "@material-ui/core";
import Skeleton from "@saleor/components/Skeleton";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    headerContainer: {
      alignItems: "flex-end",
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing(6),
    },
    pageHeader: {
      fontWeight: 600 as 600,
    },
    subtitle: {
      color: theme.typography.caption.color,
    },
  }),
  { name: "HomeHeader" },
);

interface HomeOrdersCardProps {
  userName: string;
}

const HomeOrdersCard: React.FC<HomeOrdersCardProps> = props => {
  const { userName } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.headerContainer} data-test-id="home-header">
      <div>
        <Typography
          className={classes.pageHeader}
          variant="h4"
          data-test-id="welcome-header"
        >
          {userName ? (
            <FormattedMessage
              id="By5ZBp"
              defaultMessage="Hello there, {userName}"
              description="header"
              values={{
                userName,
              }}
            />
          ) : (
            <Skeleton style={{ width: "10em" }} />
          )}
        </Typography>
        <Typography className={classes.subtitle}>
          {userName ? (
            <FormattedMessage
              id="aCX8rl"
              defaultMessage="Here is some information we gathered about your store"
              description="subheader"
            />
          ) : (
            <Skeleton style={{ width: "10em" }} />
          )}
        </Typography>
      </div>
    </div>
  );
};
HomeOrdersCard.displayName = "HomeOrdersCard";
export default HomeOrdersCard;
