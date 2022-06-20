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
  country: TaxConfigurationPerCountryFragment["country"] | undefined;
  onDelete: () => void;
}

export const TaxCountryExceptionListItem: React.FC<TaxCountryExceptionListItemProps> = ({
  country,
  onDelete
}) => (
  <ListItem hover={false}>
    <ListItemCell>{country.country}</ListItemCell>
    <ListItemCell>
      <Checkbox />
    </ListItemCell>
    <ListItemCell>
      <Checkbox />
    </ListItemCell>
    <ListItemCell>
      <IconButton onClick={onDelete} variant="secondary">
        <DeleteIcon />
      </IconButton>
    </ListItemCell>
  </ListItem>
);

export default TaxCountryExceptionListItem;
