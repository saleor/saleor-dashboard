import { Skeleton, Text, type TextProps } from "@saleor/macaw-ui-next";
import clsx from "clsx";

import {
  getAddressCityLine,
  getAddressCountryLine,
  getAddressDisplayName,
  getAddressStreetLine,
} from "./formatAddressLines";
import styles from "./ReadonlyAddress.module.css";
import { type ReadonlyAddressData, type ReadonlyAddressVariant } from "./types";

const VARIANT_SIZES: Record<
  ReadonlyAddressVariant,
  { name: TextProps["size"]; detail: TextProps["size"] }
> = {
  compact: { name: 3, detail: 2 },
  default: { name: 4, detail: 4 },
};

interface ReadonlyAddressProps {
  address?: ReadonlyAddressData;
  variant?: ReadonlyAddressVariant;
  /** Preserves legacy AddressFormatter test ids for existing tests and E2E. */
  withLegacyTestIds?: boolean;
}

export const ReadonlyAddress = ({
  address,
  variant = "default",
  withLegacyTestIds = false,
}: ReadonlyAddressProps) => {
  if (!address) {
    return <Skeleton />;
  }

  const { name: nameSize, detail: detailSize } = VARIANT_SIZES[variant];
  const displayName = getAddressDisplayName(address);
  const streetLine = getAddressStreetLine(address);
  const cityLine = getAddressCityLine(address);
  const countryLine = getAddressCountryLine(address);

  return (
    <address
      className={clsx(styles.root, variant === "compact" && styles.rootCompact)}
      data-test-id={withLegacyTestIds ? "address" : undefined}
    >
      {displayName ? (
        <Text
          size={nameSize}
          fontWeight="medium"
          color="default1"
          data-test-id={withLegacyTestIds ? "name" : undefined}
        >
          {displayName}
        </Text>
      ) : null}

      {address.companyName ? (
        <Text
          size={detailSize}
          color="default1"
          data-test-id={withLegacyTestIds ? "company-name" : undefined}
        >
          {address.companyName}
        </Text>
      ) : null}

      {address.phone ? (
        <Text
          size={detailSize}
          color="default2"
          data-test-id={withLegacyTestIds ? "phone" : undefined}
        >
          {address.phone}
        </Text>
      ) : null}

      <div
        className={clsx(styles.detailBlock, variant === "compact" && styles.detailBlockCompact)}
        data-test-id={withLegacyTestIds ? "addressLines" : undefined}
      >
        {streetLine ? (
          <Text size={detailSize} color="default1">
            {streetLine}
          </Text>
        ) : null}
        {cityLine ? (
          <Text
            size={detailSize}
            color="default1"
            data-test-id={withLegacyTestIds ? "postal-code-and-city" : undefined}
          >
            {cityLine}
          </Text>
        ) : null}
        <Text
          size={detailSize}
          color="default1"
          data-test-id={withLegacyTestIds ? "country-area-and-country" : undefined}
        >
          {countryLine}
        </Text>
      </div>
    </address>
  );
};

ReadonlyAddress.displayName = "ReadonlyAddress";
