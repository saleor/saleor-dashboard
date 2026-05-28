import { DashboardCard } from "@dashboard/components/Card";
import { CopyableText } from "@dashboard/components/CopyableText/CopyableText";
import { type CustomerDetailsFragment } from "@dashboard/graphql";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

interface ExternalReferenceCardProps {
  customer?: CustomerDetailsFragment | null;
}

export const ExternalReferenceCard = ({
  customer,
}: ExternalReferenceCardProps): JSX.Element | null => {
  const loading = !customer;

  // Hide the card entirely when the value is known to be absent — there's
  // nothing actionable for the user to do here, and an empty card just adds
  // visual noise in the sidebar.
  if (!loading && !customer.externalReference) {
    return null;
  }

  return (
    <DashboardCard data-test-id="external-reference">
      <DashboardCard.Header>
        <DashboardCard.Title size={6} fontWeight="medium">
          <FormattedMessage
            defaultMessage="External reference"
            description="customer detail sidebar, section header"
            id="nAm4XY"
          />
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {loading ? (
          <Skeleton __width="120px" __height="20px" />
        ) : (
          <Box data-test-id="external-reference-value">
            <CopyableText text={customer.externalReference ?? ""} />
          </Box>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ExternalReferenceCard.displayName = "ExternalReferenceCard";
