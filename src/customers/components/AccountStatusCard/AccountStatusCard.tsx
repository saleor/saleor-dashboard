import { DashboardCard } from "@dashboard/components/Card";
import { Pill } from "@dashboard/components/Pill";
import { type CustomerDetailsFragment } from "@dashboard/graphql";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./AccountStatusCard.module.css";

interface AccountStatusCardProps {
  customer?: CustomerDetailsFragment | null;
}

export const AccountStatusCard = ({ customer }: AccountStatusCardProps): JSX.Element => {
  const intl = useIntl();
  const loading = !customer;

  return (
    <DashboardCard data-test-id="account-status">
      <DashboardCard.Header>
        <DashboardCard.Title size={6} fontWeight="medium">
          <FormattedMessage
            defaultMessage="Account status"
            description="customer detail sidebar, section header"
            id="7zCxeu"
          />
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <div className={styles.list}>
          <Text color="default2" size={4}>
            <FormattedMessage
              defaultMessage="Status"
              description="customer account status row label"
              id="ClXTQ8"
            />
          </Text>
          {loading ? (
            <Skeleton __width="68px" __height="20px" />
          ) : customer.isActive ? (
            <Box>
              <Pill
                color="success"
                label={intl.formatMessage({
                  defaultMessage: "Active",
                  description: "customer account is active",
                  id: "8p8zxN",
                })}
                data-test-id="account-status-active"
              />
            </Box>
          ) : (
            <Box>
              <Pill
                color="neutral"
                label={intl.formatMessage({
                  defaultMessage: "Inactive",
                  description: "customer account is inactive (deactivated)",
                  id: "3DDUnc",
                })}
                data-test-id="account-status-inactive"
              />
            </Box>
          )}

          <Text color="default2" size={4}>
            <FormattedMessage
              defaultMessage="Email"
              description="customer account email-verification row label"
              id="kS9cpK"
            />
          </Text>
          {loading ? (
            <Skeleton __width="80px" __height="20px" />
          ) : customer.isConfirmed ? (
            <Box>
              <Pill
                color="success"
                label={intl.formatMessage({
                  defaultMessage: "Verified",
                  description: "customer email verification status",
                  id: "gFfJmZ",
                })}
                data-test-id="account-status-email-verified"
              />
            </Box>
          ) : (
            <Box>
              <Pill
                color="warning"
                label={intl.formatMessage({
                  defaultMessage: "Unverified",
                  description: "customer email verification status",
                  id: "D+Nw8P",
                })}
                data-test-id="account-status-email-unverified"
              />
            </Box>
          )}
        </div>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

AccountStatusCard.displayName = "AccountStatusCard";
