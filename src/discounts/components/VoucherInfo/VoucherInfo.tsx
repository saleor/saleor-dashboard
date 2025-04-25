import { DashboardCard } from "@dashboard/components/Card";
import { DiscountErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { Input } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";

interface VoucherInfoProps {
  data: VoucherDetailsPageFormData;
  errors: DiscountErrorFragment[];
  disabled: boolean;
  onChange: (event: any) => void;
}

const VoucherInfo = ({ data, disabled, errors, onChange }: VoucherInfoProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
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
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default VoucherInfo;
