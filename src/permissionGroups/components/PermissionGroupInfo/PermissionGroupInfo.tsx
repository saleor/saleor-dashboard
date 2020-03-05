import React from "react";
import { useIntl } from "react-intl";
import { FormChange } from "@saleor/hooks/useForm";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";

export interface PermissionGroupInfoProps {
  disabled: boolean;
  errors: UserError[];
  onChange: FormChange;
  data: {
    name: string;
  };
}

const PermissionGroupInfo: React.FC<PermissionGroupInfoProps> = ({
  disabled,
  onChange,
  data,
  errors
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      ></CardTitle>
      <CardContent>
        <TextField
          name="name"
          label={intl.formatMessage({
            defaultMessage: "Group name",
            description: "text field label"
          })}
          value={data.name}
          onChange={onChange}
          disabled={disabled}
          error={!!getFieldError(errors, "name")}
          helperText={getFieldError(errors, "name")?.message}
          fullWidth
        />
      </CardContent>
    </Card>
  );
};

PermissionGroupInfo.displayName = "PermissionGroupInfo";
export default PermissionGroupInfo;
