import { type AddressType } from "@dashboard/customers/types";
import { type TextProps } from "@saleor/macaw-ui-next";

import { ReadonlyAddress } from "../ReadonlyAddress/ReadonlyAddress";

interface AddressFormatterProps {
  address?: AddressType;
  /** Ignored — kept for backward compatibility with legacy callers. */
  fontSize?: TextProps["size"];
}

const AddressFormatter = ({ address }: AddressFormatterProps) => {
  return <ReadonlyAddress address={address} variant="default" withLegacyTestIds />;
};

AddressFormatter.displayName = "AddressFormatter";
export default AddressFormatter;
