import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SingleSelectField, {
  Choices
} from "@saleor/components/SingleSelectField";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    headerContainer: {
      alignItems: "flex-end",
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing(6)
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
  channelChoices: Choices;
  channelValue: string;
  onChannelChange: (value: string) => void;
}

const HomeOrdersCard: React.FC<HomeOrdersCardProps> = props => {
  const { userName, channelChoices, channelValue, onChannelChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <div className={classes.headerContainer} data-test="home-header">
      <div>
        <Typography
          className={classes.pageHeader}
          variant="h4"
          data-test="welcomeHeader"
        >
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
      <div>
        {channelChoices?.length && (
          <SingleSelectField
            name="channel"
            label={intl.formatMessage({
              defaultMessage: "Channel"
            })}
            choices={channelChoices}
            value={channelValue}
            onChange={e => onChannelChange(e.target.value)}
            data-test="channel-select"
          />
        )}
      </div>
    </div>
  );
};
HomeOrdersCard.displayName = "HomeOrdersCard";
export default HomeOrdersCard;
