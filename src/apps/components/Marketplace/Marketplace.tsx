import { Card, CardContent, Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface MarketplaceProps {
  link?: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ link }) => {
  const intl = useIntl();

  return (
    <div>
      <Card>
        <CardTitle
          title={intl.formatMessage({
            id: "SwISVH",
            defaultMessage: "Saleor Marketplace",
            description: "section header",
          })}
        />
        <CardContent>
          {!!link ? (
            <>
              <Typography variant="body2">
                <FormattedMessage
                  id="LATpSE"
                  defaultMessage="Discover great free and paid apps in our Saleor Marketplace."
                  description="marketplace content"
                />
              </Typography>
              <Button onClick={link}>
                <FormattedMessage
                  id="wxFwUW"
                  defaultMessage="Visit Marketplace"
                  description="marketplace button"
                />
              </Button>
            </>
          ) : (
            <Typography variant="body2">
              <FormattedMessage
                id="NskBjH"
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
