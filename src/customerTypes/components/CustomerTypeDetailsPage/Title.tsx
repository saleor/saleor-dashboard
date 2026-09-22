import { Pill } from "@dashboard/components/Pill/Pill";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface CustomerTypeDetailsHeaderCustomerType {
  name: string;
  isDefault: boolean;
}

interface CustomerTypeDetailsTitleProps {
  customerType?: CustomerTypeDetailsHeaderCustomerType | null;
  loading?: boolean;
}

export const CustomerTypeDetailsTitle = ({
  customerType,
  loading,
}: CustomerTypeDetailsTitleProps) => {
  const intl = useIntl();
  const isHeaderLoading = loading && !customerType;

  if (isHeaderLoading) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <Skeleton __width="12em" data-test-id="customer-type-details-title-skeleton" />
      </Box>
    );
  }

  if (!customerType) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center" gap={2} flexWrap="nowrap" __minWidth="0">
      <Box
        title={customerType.name}
        __maxWidth="320px"
        __overflow="hidden"
        __textOverflow="ellipsis"
        __whiteSpace="nowrap"
        __minWidth="0"
      >
        {customerType.name}
      </Box>
      {customerType.isDefault ? (
        <Pill
          data-test-id="customer-type-default-pill"
          label={intl.formatMessage(messages.defaultPill)}
          color="success"
        />
      ) : null}
    </Box>
  );
};
