import { Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { AddressType } from "../../customers/types";

/**
 * @interface AddressFormatterProps
 * @property {AddressType} [address] - 要格式化的地址对象。
 *
 * AddressFormatter 组件的属性。
 */
interface AddressFormatterProps {
  address?: AddressType;
}

/**
 * AddressFormatter 组件，用于以标准格式显示地址。
 *
 * 如果未提供地址，则显示一个骨架加载状态。
 *
 * @param {AddressFormatterProps} props - AddressFormatter 组件的属性。
 * @returns {React.ReactElement} 一个呈现格式化地址或骨架加载状态的 React 元素。
 */
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
