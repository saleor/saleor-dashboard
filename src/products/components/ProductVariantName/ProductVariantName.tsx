import { Card, CardContent, TextField } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { ProductErrorFragment } from "@saleor/graphql";
import { FormChange } from "@saleor/hooks/useForm";
import { commonMessages } from "@saleor/intl";
import { getFormErrors, getProductErrorMessage } from "@saleor/utils/errors";
import React from "react";
import { useIntl } from "react-intl";

import { ProductVariantUpdateData } from "../ProductVariantPage/form";

interface Props {
  data: ProductVariantUpdateData;
  onChange: FormChange<any>;
  disabled: boolean;
  errors: ProductErrorFragment[];
}

const ProductVariantName = ({ data, onChange, disabled, errors }: Props) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "T1f2Yl",
          defaultMessage: "Variant Name",
        })}
      />
      <CardContent>
        <TextField
          name="name"
          value={data.name}
          label={intl.formatMessage(commonMessages.name)}
          onChange={onChange}
          error={!!formErrors.name}
          fullWidth
          disabled={disabled}
          helperText={getProductErrorMessage(formErrors.name, intl)}
          required
        />
      </CardContent>
    </Card>
  );
};

ProductVariantName.displayName = "ProductVariantName";
export default ProductVariantName;
