import { DashboardCard } from "@dashboard/components/Card";
import { ProductErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { Input } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

interface ProductVariantNameProps {
  value: string;
  onChange: FormChange<any>;
  disabled?: boolean;
  errors: ProductErrorFragment[];
}

const ProductVariantName: React.FC<ProductVariantNameProps> = ({
  value,
  onChange,
  disabled,
  errors,
}) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Title>
        {intl.formatMessage({
          id: "T1f2Yl",
          defaultMessage: "Variant Name",
        })}
      </DashboardCard.Title>
      <DashboardCard.Content>
        <Input
          width="100%"
          name="variantName"
          value={value}
          label={intl.formatMessage(commonMessages.name)}
          onChange={onChange}
          error={!!formErrors.name}
          disabled={disabled}
          helperText={getProductErrorMessage(formErrors.name, intl)}
          data-test-id="variant-name-input"
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductVariantName.displayName = "ProductVariantName";
export default ProductVariantName;
