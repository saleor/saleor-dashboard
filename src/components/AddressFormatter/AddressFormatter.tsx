import { Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { AddressType } from "../../customers/types";

interface AddressFormatterProps {
  address?: AddressType;
}

const AddressFormatter: React.FC<AddressFormatterProps> = ({ address }) => {
  if (!address) {
    return <Skeleton />;
  }

  return (
    <address
      data-test-id="address"
      style={{
        fontStyle: "inherit",
      }}
    >
      <Text as="p" data-test-id="name">
        {address.firstName} {address.lastName}
      </Text>
      <Text as="p" data-test-id="phone">
        {address.phone}
      </Text>
      {address.companyName && (
        <Text as="p" data-test-id="company-name">
          {address.companyName}
        </Text>
      )}
      <Text as="p" data-test-id="addressLines">
        {address.streetAddress1}
        <br />
        {address.streetAddress2}
      </Text>
      <Text as="p" data-test-id="postal-code-and-city">
        {" "}
        {address.postalCode} {address.city}
        {address.cityArea ? ", " + address.cityArea : ""}
      </Text>
      <Text as="p" data-test-id="country-area-and-country">
        {address.countryArea
          ? address.countryArea + ", " + address.country.country
          : address.country.country}
      </Text>
    </address>
  );
};

AddressFormatter.displayName = "AddressFormatter";
export default AddressFormatter;
