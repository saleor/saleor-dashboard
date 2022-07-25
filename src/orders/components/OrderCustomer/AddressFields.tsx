import { Typography } from "@material-ui/core";
import { AddressFragment } from "@saleor/graphql";
import React from "react";

interface AddressFieldsProps {
  address: AddressFragment;
}

export const AddressFields: React.FC<AddressFieldsProps> = ({ address }) => (
  <>
    {address.companyName && <Typography>{address.companyName}</Typography>}
    <Typography>
      {address.firstName} {address.lastName}
    </Typography>
    <Typography>
      {address.streetAddress1}
      <br />
      {address.streetAddress2}
    </Typography>
    <Typography>
      {address.postalCode} {address.city}
      {address.cityArea ? ", " + address.cityArea : ""}
    </Typography>
    <Typography>
      {address.countryArea
        ? address.countryArea + ", " + address.country.country
        : address.country.country}
    </Typography>
    <Typography>{address.phone}</Typography>
  </>
);
