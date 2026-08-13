import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { commonMessages } from "@dashboard/intl";
import { type UserError } from "@dashboard/types";
import { getFieldError } from "@dashboard/utils/errors";
import { Input } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

interface ProductTypeDetailsProps {
  data?: {
    name: string;
  };
  autoFocus?: boolean;
  disabled: boolean;
  errors: UserError[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductTypeDetails = ({
  autoFocus = false,
  data,
  disabled,
  errors,
  onChange,
}: ProductTypeDetailsProps) => {
  const intl = useIntl();
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoFocus || disabled) {
      return;
    }

    nameInputRef.current?.focus();
  }, [autoFocus, disabled]);

  return (
    <DetailSettingsCard title={intl.formatMessage(commonMessages.generalInformations)}>
      <Input
        ref={nameInputRef}
        disabled={disabled}
        error={!!getFieldError(errors, "name")}
        width="100%"
        helperText={getFieldError(errors, "name")?.message}
        label={intl.formatMessage(commonMessages.name)}
        name="name"
        onChange={onChange}
        value={data?.name ?? ""}
      />
    </DetailSettingsCard>
  );
};

ProductTypeDetails.displayName = "ProductTypeDetails";
export default ProductTypeDetails;
