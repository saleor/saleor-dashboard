// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { commonMessages } from "@dashboard/intl";
import { type UserError } from "@dashboard/types";
import { getFieldError } from "@dashboard/utils/errors";
import { Input } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface ProductTypeDetailsProps {
  data?: {
    name: string;
  };
  autoFocus?: boolean;
  disabled: boolean;
  errors: UserError[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductTypeDetails = (props: ProductTypeDetailsProps) => {
  const { autoFocus = false, data, disabled, errors, onChange } = props;
  const intl = useIntl();
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoFocus || disabled) {
      return;
    }

    nameInputRef.current?.focus();
  }, [autoFocus, disabled]);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Input
          ref={nameInputRef}
          disabled={disabled}
          error={!!getFieldError(errors, "name")}
          width="100%"
          helperText={getFieldError(errors, "name")?.message}
          label={intl.formatMessage(messages.productTypeName)}
          name="name"
          onChange={onChange}
          value={data.name}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductTypeDetails.displayName = "ProductTypeDetails";
export default ProductTypeDetails;
