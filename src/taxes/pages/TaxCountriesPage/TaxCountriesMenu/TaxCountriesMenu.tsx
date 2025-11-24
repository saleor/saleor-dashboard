import { CardTitle } from "@dashboard/components/CardTitle/CardTitle";
import ListItemLink from "@dashboard/components/ListItemLink";
import { TaxCountryConfigurationFragment } from "@dashboard/graphql";
import { taxesMessages } from "@dashboard/taxes/messages";
import { taxCountriesListUrl } from "@dashboard/taxes/urls";
import { isLastElement } from "@dashboard/taxes/utils/utils";
import { Card, CardContent, Divider } from "@material-ui/core";
import { List, ListHeader, ListItem, ListItemCell } from "@saleor/macaw-ui";
import { Button, Skeleton, TrashBinIcon } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

interface TaxCountriesMenuProps {
  configurations: TaxCountryConfigurationFragment[] | undefined;
  selectedCountryId: string;
  onCountryDelete: (countryId: string) => void;
  onCountryAdd: () => void;
}

const TaxCountriesMenu = ({
  configurations,
  selectedCountryId,
  onCountryDelete,
  onCountryAdd,
}: TaxCountriesMenuProps) => {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Card className={classes.menu}>
      <CardTitle
        title={intl.formatMessage(taxesMessages.countryList)}
        toolbar={
          <Button onClick={onCountryAdd} variant="secondary" data-test-id="add-country-button">
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
            <Fragment key={config.country.code}>
              <ListItemLink
                data-test-id="countries-list-rows"
                className={clsx(classes.clickable, classes.tableRow, {
                  [classes.selected]: config.country.code === selectedCountryId,
                })}
                href={taxCountriesListUrl(config.country.code)}
              >
                <ListItemCell>
                  <div className={classes.spaceBetween}>
                    {config.country.country}
                    <Button
                      icon={<TrashBinIcon />}
                      variant="tertiary"
                      onClick={event => {
                        event.stopPropagation();
                        event.preventDefault();
                        onCountryDelete(config.country.code);
                      }}
                    />
                  </div>
                </ListItemCell>
              </ListItemLink>
              {!isLastElement(configurations, configIndex) && <Divider />}
            </Fragment>
          )) ?? <Skeleton />}
        </List>
      )}
    </Card>
  );
};

export default TaxCountriesMenu;
