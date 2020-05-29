import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";

interface MarketplaceProps {
  link?: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ link }) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <div className={classes.appContainer}>
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Saleor Marketplace",
            description: "section header"
          })}
        />
        <CardContent className={classes.marketplaceContent}>
          {!!link ? (
            <>
              <Typography variant="body2">
                <FormattedMessage
                  defaultMessage="Discover great free and paid apps in our Saleor Marketplace."
                  description="marketplace content"
                />
              </Typography>
              <Button color="primary" onClick={link}>
                <FormattedMessage
                  defaultMessage="Visit Marketplace"
                  description="marketplace button"
                />
              </Button>
            </>
          ) : (
            <Typography variant="body2">
              <FormattedMessage
                defaultMessage="Marketplace is coming soon"
                description="marketplace content"
              />
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

Marketplace.displayName = "Marketplace";
export default Marketplace;
