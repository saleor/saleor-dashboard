import { Checkbox } from "@material-ui/core";
import {
  DeleteIcon,
  IconButton,
  ListItem,
  ListItemCell
} from "@saleor/macaw-ui";
import React from "react";

interface TaxCountryExceptionListItemProps {
  country: any;
}

export const TaxCountryExceptionListItem: React.FC<TaxCountryExceptionListItemProps> = ({
  country
}) => (
  <ListItem hover={false}>
    <ListItemCell>{country.name}</ListItemCell>
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
