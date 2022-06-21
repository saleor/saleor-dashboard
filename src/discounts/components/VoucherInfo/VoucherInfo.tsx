import { Card, CardContent, TextField } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import { DiscountErrorFragment } from "@saleor/graphql";
import { commonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import getDiscountErrorMessage from "@saleor/utils/errors/discounts";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { generateCode } from "../../../misc";
import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";

interface VoucherInfoProps {
  data: VoucherDetailsPageFormData;
  errors: DiscountErrorFragment[];
  disabled: boolean;
  variant: "create" | "update";
  onChange: (event: any) => void;
}

const VoucherInfo = ({
  data,
  disabled,
  errors,
  variant,
  onChange,
}: VoucherInfoProps) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["code"], errors);

  const onGenerateCode = () =>
    onChange({
      target: {
        name: "code",
        value: generateCode(10),
      },
    });

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
        toolbar={
          variant === "create" && (
            <Button onClick={onGenerateCode} data-test-id="generate-code">
              <FormattedMessage
                id="mSLr9d"
                defaultMessage="Generate Code"
                description="voucher code, button"
              />
            </Button>
          )
        }
      />
      <CardContent>
        <TextField
          disabled={variant === "update" || disabled}
          error={!!formErrors.code}
          fullWidth
          helperText={getDiscountErrorMessage(formErrors.code, intl)}
          name={"code" as keyof VoucherDetailsPageFormData}
          label={intl.formatMessage({
            id: "jvKNMP",
            defaultMessage: "Discount Code",
          })}
          value={data.code}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
export default VoucherInfo;
