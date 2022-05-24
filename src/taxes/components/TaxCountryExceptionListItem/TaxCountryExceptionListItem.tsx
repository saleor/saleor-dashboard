import { Checkbox } from "@material-ui/core";
import { TaxConfigurationPerCountryFragment } from "@saleor/graphql";
import {
  DeleteIcon,
  IconButton,
  ListItem,
  ListItemCell
} from "@saleor/macaw-ui";
import React from "react";

interface TaxCountryExceptionListItemProps {
  country: TaxConfigurationPerCountryFragment;
  countryName: string;
}

export const TaxCountryExceptionListItem: React.FC<TaxCountryExceptionListItemProps> = ({
  countryName
}) => (
  <ListItem hover={false}>
    <ListItemCell>{countryName}</ListItemCell>
    <ListItemCell>
      <Checkbox />
    </ListItemCell>
    <ListItemCell>
      <Checkbox />
    </ListItemCell>
    <ListItemCell>
      <IconButton variant="secondary">
        <DeleteIcon />
      </IconButton>
    </ListItemCell>
  </ListItem>
);

export default TaxCountryExceptionListItem;
