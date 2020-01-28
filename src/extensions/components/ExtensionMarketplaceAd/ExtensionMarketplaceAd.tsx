import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import CardTitle from "@saleor/components/CardTitle";

export interface ExtensionMarketplaceAdProps {
  onMarketplaceClick: () => void;
}

const useStyles = makeStyles(
  theme => ({
    btn: {
      left: -theme.spacing(),
      marginTop: theme.spacing(2),
      position: "relative"
    }
  }),
  {
    name: "ExtensionMarketplaceAd"
  }
);

const ExtensionMarketplaceAd: React.FC<ExtensionMarketplaceAdProps> = ({
  onMarketplaceClick
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Saleor Marketplace",
          description: "header"
        })}
      />
      <CardContent>
        <Typography>
          <FormattedMessage defaultMessage="Discover great free and paid apps in our Saleor Marketplace" />
        </Typography>
        <Button
          className={classes.btn}
          color="primary"
          onClick={onMarketplaceClick}
        >
          <FormattedMessage
            defaultMessage="Visit Marketplace"
            description="button"
          />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExtensionMarketplaceAd;
