import { Card } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ListItemLink from "@saleor/components/ListItemLink";
import Skeleton from "@saleor/components/Skeleton";
import {
  CountryFragment,
  TaxCountryConfigurationFragment
} from "@saleor/graphql";
import {
  Button,
  DeleteIcon,
  IconButton,
  List,
  ListHeader,
  ListItem,
  ListItemCell
} from "@saleor/macaw-ui";
import { taxesMessages } from "@saleor/taxes/messages";
import { countriesListUrl } from "@saleor/taxes/urls";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

interface TaxCountriesMenuProps {
  countries: TaxCountryConfigurationFragment[];
  countryNames: CountryFragment[];
  selectedCountryId: string;
  onCountryDelete: (countryId: string) => void;
}

export const TaxCountriesMenu: React.FC<TaxCountriesMenuProps> = ({
  countries,
  countryNames,
  selectedCountryId,
  onCountryDelete
}) => {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(taxesMessages.countryList)}
        toolbar={
          <Button variant="secondary">
            <FormattedMessage {...taxesMessages.addCountryLabel} />
          </Button>
        }
      />
      <div className={classes.scrollWrapper}>
        <List gridTemplate={["1fr"]}>
          <ListHeader>
            <ListItem className={classes.tableRow}>
              <ListItemCell>
                <FormattedMessage {...taxesMessages.countryNameHeader} />
              </ListItemCell>
            </ListItem>
          </ListHeader>
          {countries?.map(country => (
            <ListItemLink
              key={country.countryCode}
              className={clsx(classes.clickable, classes.tableRow, {
                [classes.selected]: country.countryCode === selectedCountryId
              })}
              href={countriesListUrl(country.countryCode)}
            >
              <ListItemCell>
                <div className={classes.spaceBetween}>
                  {
                    countryNames?.find(
                      name => name.code === country.countryCode
                    )?.country
                  }
                  <IconButton
                    variant="secondary"
                    onClick={event => {
                      event.stopPropagation();
                      onCountryDelete(country.countryCode);
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
    </Card>
  );
};

export default TaxCountriesMenu;
