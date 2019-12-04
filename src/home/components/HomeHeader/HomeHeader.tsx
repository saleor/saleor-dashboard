import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage } from "react-intl";

import Skeleton from "@saleor/components/Skeleton";

const useStyles = makeStyles(
  theme => ({
    headerContainer: {
      marginBottom: theme.spacing(3)
    },
    pageHeader: {
      fontWeight: 600 as 600
    },
    subtitle: {
      color: theme.typography.caption.color
    }
  }),
  { name: "HomeHeader" }
);

interface HomeOrdersCardProps {
  userName: string;
}

const HomeOrdersCard: React.FC<HomeOrdersCardProps> = props => {
  const { userName } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.headerContainer} data-tc="home-header">
      <Typography className={classes.pageHeader} variant="h4">
        {userName ? (
          <FormattedMessage
            defaultMessage="Hello there, {userName}"
            description="header"
            id="homeHeaderText"
            values={{
              userName
            }}
          />
        ) : (
          <Skeleton style={{ width: "10em" }} />
        )}
      </Typography>
      <Typography className={classes.subtitle}>
        {userName ? (
          <FormattedMessage
            defaultMessage="Here is some information we gathered about your store"
            description="subheader"
            id="homeHeaderTextCaption"
          />
        ) : (
          <Skeleton style={{ width: "10em" }} />
        )}
      </Typography>
    </div>
  );
};
HomeOrdersCard.displayName = "HomeOrdersCard";
export default HomeOrdersCard;
