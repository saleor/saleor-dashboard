import { Skeleton, Text, TextProps } from "@saleor/macaw-ui-next";

import { AddressType } from "../../customers/types";

interface AddressFormatterProps {
  address?: AddressType;
  fontSize?: TextProps["size"];
}

const AddressFormatter = ({ address, fontSize }: AddressFormatterProps) => {
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
      <Text as="p" data-test-id="name" size={fontSize}>
        {address.firstName} {address.lastName}
      </Text>
      <Text as="p" data-test-id="phone" size={fontSize}>
        {address.phone}
      </Text>
      {address.companyName && (
        <Text as="p" data-test-id="company-name" size={fontSize}>
          {address.companyName}
        </Text>
      )}
      <Text as="p" data-test-id="addressLines" size={fontSize}>
        {address.streetAddress1}
        <br />
        {address.streetAddress2}
      </Text>
      <Text as="p" data-test-id="postal-code-and-city" size={fontSize}>
        {" "}
        {address.postalCode} {address.city}
        {address.cityArea ? ", " + address.cityArea : ""}
      </Text>
      <Text as="p" data-test-id="country-area-and-country" size={fontSize}>
        {address.countryArea
          ? address.countryArea + ", " + address.country.country
          : address.country.country}
      </Text>
    </address>
  );
};

AddressFormatter.displayName = "AddressFormatter";
export default AddressFormatter;
