import { Card, CardContent, Divider } from "@material-ui/core";
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
import { isLastElement } from "@saleor/taxes/utils/utils";
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
  onCountryAdd,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Card className={classes.menu}>
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
        <List gridTemplate={["1fr"]}>
          <ListHeader>
            <ListItem className={classes.tableRow}>
              <ListItemCell>
                <FormattedMessage {...taxesMessages.countryNameHeader} />
              </ListItemCell>
            </ListItem>
          </ListHeader>
          <Divider />
          {configurations?.map((config, configIndex) => (
            <React.Fragment key={config.country.code}>
              <ListItemLink
                className={clsx(classes.clickable, classes.tableRow, {
                  [classes.selected]: config.country.code === selectedCountryId,
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
                        event.preventDefault();
                        onCountryDelete(config.country.code);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </ListItemCell>
              </ListItemLink>
              {!isLastElement(configurations, configIndex) && <Divider />}
            </React.Fragment>
          )) ?? <Skeleton />}
        </List>
      )}
    </Card>
  );
};

export default TaxCountriesMenu;
