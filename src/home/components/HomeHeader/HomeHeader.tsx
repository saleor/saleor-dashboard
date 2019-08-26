import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage } from "react-intl";

import Skeleton from "@saleor/components/Skeleton";

const styles = (theme: Theme) =>
  createStyles({
    headerContainer: {
      marginBottom: theme.spacing.unit * 3
    },
    pageHeader: {
      fontWeight: 600 as 600
    },
    subtitle: {
      color: theme.typography.caption.color
    }
  });

interface HomeOrdersCardProps extends WithStyles<typeof styles> {
  userName: string;
}

const HomeOrdersCard = withStyles(styles, { name: "HomeOrdersCard" })(
  ({ classes, userName }: HomeOrdersCardProps) => (
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
  )
);
HomeOrdersCard.displayName = "HomeOrdersCard";
export default HomeOrdersCard;
