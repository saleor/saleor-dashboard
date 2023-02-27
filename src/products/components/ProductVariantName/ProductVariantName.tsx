import CardTitle from '@dashboard/components/CardTitle';
import { ProductErrorFragment } from '@dashboard/graphql';
import { FormChange } from '@dashboard/hooks/useForm';
import { commonMessages } from '@dashboard/intl';
import { getFormErrors, getProductErrorMessage } from '@dashboard/utils/errors';
import { Card, CardContent, TextField } from '@material-ui/core';
import React from 'react';
import { useIntl } from 'react-intl';

interface ProductVariantNameProps {
  value: string;
  onChange: FormChange<any>;
  disabled?: boolean;
  errors: ProductErrorFragment[];
}

const ProductVariantName: React.FC<ProductVariantNameProps> = ({ value, onChange, disabled, errors }) => {
  const intl = useIntl();
  const formErrors = getFormErrors(['name'], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: 'T1f2Yl',
          defaultMessage: 'Variant Name',
        })}
      />
      <CardContent>
        <TextField
          name="variantName"
          value={value}
          label={intl.formatMessage(commonMessages.name)}
          onChange={onChange}
          error={!!formErrors.name}
          fullWidth
          disabled={disabled}
          helperText={getProductErrorMessage(formErrors.name, intl)}
          data-test-id="variant-name"
        />
      </CardContent>
    </Card>
  );
};

ProductVariantName.displayName = 'ProductVariantName';
export default ProductVariantName;
