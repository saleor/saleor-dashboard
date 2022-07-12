import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ListItemLink from "@saleor/components/ListItemLink";
import Skeleton from "@saleor/components/Skeleton";
import { TaxCountryConfigurationFragment } from "@saleor/graphql";
import {
  Button,
  DeleteIcon,
  IconButton,
  List,
  ListHeader,
  ListItem,
  ListItemCell,
} from "@saleor/macaw-ui";
import { taxesMessages } from "@saleor/taxes/messages";
import { taxCountriesListUrl } from "@saleor/taxes/urls";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

interface TaxCountriesMenuProps {
  configurations: TaxCountryConfigurationFragment[] | undefined;
  selectedCountryId: string;
  onCountryDelete: (countryId: string) => void;
  onCountryAdd: () => void;
}

export const TaxCountriesMenu: React.FC<TaxCountriesMenuProps> = ({
  configurations,
  selectedCountryId,
  onCountryDelete,
  onCountryAdd
}) => {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(taxesMessages.countryList)}
        toolbar={
          <Button onClick={onCountryAdd} variant="secondary">
            <FormattedMessage {...taxesMessages.addCountryLabel} />
          </Button>
        }
      />
      {configurations?.length === 0 ? (
        <CardContent className={classes.greyText}>
          <FormattedMessage {...taxesMessages.noCountriesAssigned} />
        </CardContent>
      ) : (
        <div className={classes.scrollWrapper}>
          <List gridTemplate={["1fr"]}>
            <ListHeader>
              <ListItem className={classes.tableRow}>
                <ListItemCell>
                  <FormattedMessage {...taxesMessages.countryNameHeader} />
                </ListItemCell>
              </ListItem>
            </ListHeader>
            {configurations?.map(config => (
              <ListItemLink
                key={config.country.code}
                className={clsx(classes.clickable, classes.tableRow, {
                  [classes.selected]: config.country.code === selectedCountryId
                })}
                href={taxCountriesListUrl(config.country.code)}
              >
                <ListItemCell>
                  <div className={classes.spaceBetween}>
                    {config.country.country}
                    <IconButton
                      variant="secondary"
                      onClick={event => {
                        event.stopPropagation();
                        onCountryDelete(config.country.code);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </ListItemCell>
              </ListItemLink>
            )) ?? <Skeleton />}
          </List>
        </div>
      )}
    </Card>
  );
};

export default TaxCountriesMenu;
