import { Typography } from "@material-ui/core";
import React from "react";

import { AddressType } from "../../customers/types";
import Skeleton from "../Skeleton";

interface AddressFormatterProps {
  address?: AddressType;
}

const AddressFormatter: React.FC<AddressFormatterProps> = ({ address }) => {
  if (!address) {
    return <Skeleton />;
  }
  return (
    <address
      style={{
        fontStyle: "inherit",
      }}
    >
      <Typography component="p">
        {address.firstName} {address.lastName}
      </Typography>
      <Typography component="p">{address.phone}</Typography>
      {address.companyName && (
        <Typography component="p">{address.companyName}</Typography>
      )}
      <Typography component="p">
        {address.streetAddress1}
        <br />
        {address.streetAddress2}
      </Typography>
      <Typography component="p">
        {" "}
        {address.postalCode} {address.city}
        {address.cityArea ? ", " + address.cityArea : ""}
      </Typography>
      <Typography component="p">
        {address.countryArea
          ? address.countryArea + ", " + address.country.country
          : address.country.country}
      </Typography>
    </address>
  );
};
AddressFormatter.displayName = "AddressFormatter";
export default AddressFormatter;
