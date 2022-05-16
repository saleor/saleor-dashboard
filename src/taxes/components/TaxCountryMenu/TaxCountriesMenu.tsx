import { Card } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import CardTitle from "@saleor/components/CardTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import {
  Button,
  DeleteIcon,
  IconButton,
  List,
  ListHeader,
  ListItem,
  ListItemCell,
  makeStyles
} from "@saleor/macaw-ui";
import { taxesMessages } from "@saleor/taxes/messages";
import { countriesListUrl } from "@saleor/taxes/urls";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface TaxCountriesMenuProps {
  countries: any;
  selectedCountryId: string;
  onCountryDelete: (countryId: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    clickable: {
      cursor: "pointer"
    },
    scrollWrapper: {
      overflow: "scroll",
      maxHeight: 600
    },
    selected: {
      borderLeft: `4px solid ${theme.palette.saleor.active[1]}`
    },
    spaceBetween: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }),
  { name: "TaxCountriesMenu" }
);

export const TaxCountriesMenu: React.FC<TaxCountriesMenuProps> = ({
  countries,
  selectedCountryId,
  onCountryDelete
}) => {
  const navigate = useNavigator();
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
            <ListItem>
              <ListItemCell>
                <FormattedMessage {...taxesMessages.countryNameHeader} />
              </ListItemCell>
            </ListItem>
          </ListHeader>
          {countries?.map(country => (
            <ListItem
              key={country.id}
              className={clsx(classes.clickable, {
                [classes.selected]: country.id === selectedCountryId
              })}
              onClick={() => navigate(countriesListUrl(country.id))}
            >
              <ListItemCell>
                <div className={classes.spaceBetween}>
                  {country.name}
                  <IconButton
                    variant="secondary"
                    onClick={event => {
                      event.stopPropagation();
                      onCountryDelete(country.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </ListItemCell>
            </ListItem>
          )) ?? <Skeleton />}
        </List>
      </div>
    </Card>
  );
};

export default TaxCountriesMenu;
