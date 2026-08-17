import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { type DiscountErrorFragment } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { Box, Input, Skeleton, Text } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type VoucherDetailsPageFormData } from "../VoucherDetailsPage";

interface VoucherInfoProps {
  data: VoucherDetailsPageFormData;
  errors: DiscountErrorFragment[];
  disabled: boolean;
  loading?: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const VoucherInfo = ({
  data,
  disabled,
  loading = false,
  errors,
  onChange,
}: VoucherInfoProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <DetailSettingsCard
      data-test-id="voucher-details-section"
      title={intl.formatMessage({
        id: "5xOAYZ",
        defaultMessage: "Details",
        description: "voucher details section title",
      })}
      intro={
        <Text size={3} color="default2">
          <FormattedMessage
            id="tQnYA/"
            defaultMessage="Internal name for staff. Customers redeem voucher codes at checkout, not this label."
            description="voucher details section intro"
          />
        </Text>
      }
    >
      {loading ? (
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          data-test-id="voucher-details-skeleton"
          aria-busy="true"
        >
          <Skeleton __width="6rem" __height="0.875rem" />
          <Skeleton __height="2.5rem" />
        </Box>
      ) : (
        <Input
          size="small"
          disabled={disabled}
          error={!!formErrors.name}
          helperText={getDiscountErrorMessage(formErrors.name, intl)}
          name={"name" as keyof VoucherDetailsPageFormData}
          label={intl.formatMessage({
            id: "sfErC+",
            defaultMessage: "Voucher Name",
          })}
          value={data.name}
          onChange={onChange}
          data-test-id="voucher-name-input"
        />
      )}
    </DetailSettingsCard>
  );
};

export default VoucherInfo;
