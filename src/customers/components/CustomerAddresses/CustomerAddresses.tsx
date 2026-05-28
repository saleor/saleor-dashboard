import AddressFormatter from "@dashboard/components/AddressFormatter";
import { formatAddressForClipboard } from "@dashboard/components/AddressFormatter/formatForClipboard";
import { DashboardCard } from "@dashboard/components/Card";
import { type CustomerDetailsFragment } from "@dashboard/graphql";
import { useClipboard } from "@dashboard/hooks/useClipboard";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { CheckIcon, CopyIcon } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import styles from "./CustomerAddresses.module.css";

interface CustomerAddressesProps {
  customer: CustomerDetailsFragment | null | undefined;
  disabled: boolean;
  manageAddressHref: string;
}

interface AddressBlockProps {
  label: ReactNode;
  address: NonNullable<CustomerDetailsFragment["defaultBillingAddress"]>;
}

const AddressBlock = ({ label, address }: AddressBlockProps): JSX.Element => {
  const intl = useIntl();
  const [copied, copy] = useClipboard();
  const copyAriaLabel = intl.formatMessage(buttonMessages.copyToClipboard);

  return (
    <Box className={styles.addressBlock} display="flex" flexDirection="column" gap={2}>
      <Text color="default2" size={4}>
        {label}
      </Text>
      <Box position="relative">
        <AddressFormatter address={address} />
        <Box
          position="absolute"
          __right={0}
          __top={0}
          className={styles.copyButton}
          pointerEvents={copied ? "auto" : undefined}
        >
          <Button
            variant="tertiary"
            size="small"
            icon={copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            onClick={() => copy(formatAddressForClipboard(address))}
            aria-label={copyAriaLabel}
            title={copyAriaLabel}
          />
        </Box>
      </Box>
    </Box>
  );
};

const CustomerAddresses = ({
  customer,
  disabled,
  manageAddressHref,
}: CustomerAddressesProps): JSX.Element => {
  const billing = customer?.defaultBillingAddress ?? null;
  const shipping = customer?.defaultShippingAddress ?? null;
  const sameAddress = billing && shipping && billing.id === shipping.id;
  const hasAnyAddress = billing !== null || shipping !== null;

  return (
    <DashboardCard data-test-id="customer-addresses">
      <DashboardCard.Header>
        <DashboardCard.Title size={6} fontWeight="medium">
          <FormattedMessage id="BfJGij" defaultMessage="Address Information" description="header" />
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Link to={manageAddressHref}>
            <Button data-test-id="manage-addresses" disabled={disabled} variant="secondary">
              <FormattedMessage {...buttonMessages.manage} />
            </Button>
          </Link>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {!hasAnyAddress ? (
          <Text>
            <FormattedMessage id="3d1RXL" defaultMessage="This customer has no addresses yet" />
          </Text>
        ) : sameAddress ? (
          <Box className={`${styles.grid}`}>
            <AddressBlock
              label={
                <FormattedMessage
                  defaultMessage="Default address"
                  description="customer detail, label above the address when default billing and default shipping are the same"
                  id="U+Fl4Z"
                />
              }
              address={billing}
            />
          </Box>
        ) : (
          <Box className={`${styles.grid} ${styles.gridSplit}`}>
            {billing && (
              <AddressBlock
                label={
                  <FormattedMessage
                    id="biVFKU"
                    defaultMessage="Billing Address"
                    description="subsection header"
                  />
                }
                address={billing}
              />
            )}
            {shipping && (
              <AddressBlock
                label={
                  <FormattedMessage
                    id="Zd3Eew"
                    defaultMessage="Shipping Address"
                    description="subsection header"
                  />
                }
                address={shipping}
              />
            )}
          </Box>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomerAddresses.displayName = "CustomerAddresses";
export default CustomerAddresses;
