import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Button from "@material-ui/core/Button";
import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
import { generateCode } from "../../../misc";
import { FormErrors } from "../../../types";
import { FormData } from "../VoucherDetailsPage";

interface VoucherInfoProps {
  data: FormData;
  errors: FormErrors<"code">;
  disabled: boolean;
  variant: "create" | "update";
  onChange: (event: any) => void;
}

const VoucherInfo = ({
  data,
  disabled,
  errors,
  variant,
  onChange
}: VoucherInfoProps) => {
  const intl = useIntl();

  const onGenerateCode = () =>
    onChange({
      target: {
        name: "code",
        value: generateCode(10)
      }
    });

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
        toolbar={
          variant === "create" && (
            <Button color="primary" onClick={onGenerateCode}>
              <FormattedMessage
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
          error={!!errors.code}
          fullWidth
          helperText={errors.code}
          name={"code" as keyof FormData}
          label={intl.formatMessage({
            defaultMessage: "Discount Code"
          })}
          value={data.code}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
export default VoucherInfo;
