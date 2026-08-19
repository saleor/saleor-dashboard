import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { ProductTypeKindEnum } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { type UserError } from "@dashboard/types";
import { getFieldError } from "@dashboard/utils/errors";
import { Box, Input } from "@saleor/macaw-ui-next";
import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import { ProductTypeKindTiles } from "../ProductTypeKindTiles/ProductTypeKindTiles";

interface ProductTypeDetailsProps {
  data?: {
    name: string;
    kind: ProductTypeKindEnum;
  };
  autoFocus?: boolean;
  disabled: boolean;
  errors: UserError[];
  onChange: (event: ChangeEvent<any>) => void;
}

const ProductTypeDetails = ({
  autoFocus = false,
  data,
  disabled,
  errors,
  onChange,
}: ProductTypeDetailsProps): JSX.Element => {
  const intl = useIntl();
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(
    function focusNameInput() {
      if (!autoFocus || disabled) {
        return;
      }

      nameInputRef.current?.focus();
    },
    [autoFocus, disabled],
  );

  return (
    <DetailSettingsCard
      title={intl.formatMessage(commonMessages.generalInformations)}
      data-test-id="product-type-general-information"
    >
      <Box display="flex" flexDirection="column" gap={5}>
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
        <ProductTypeKindTiles
          value={data?.kind ?? ProductTypeKindEnum.NORMAL}
          disabled={disabled}
          onChange={kind => onChange({ target: { name: "kind", value: kind } })}
        />
      </Box>
    </DetailSettingsCard>
  );
};

ProductTypeDetails.displayName = "ProductTypeDetails";
export default ProductTypeDetails;
