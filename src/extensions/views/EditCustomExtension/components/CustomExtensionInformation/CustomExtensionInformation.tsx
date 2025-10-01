// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { AppErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import getAppErrorMessage from "@dashboard/utils/errors/app";
import { Input } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface CustomExtensionInfoProps {
  data: {
    name: string;
  };
  disabled: boolean;
  errors: AppErrorFragment[];
  onChange: FormChange;
}

export const CustomExtensionInformation = ({
  data,
  disabled,
  errors,
  onChange,
}: CustomExtensionInfoProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "YtCaCm",
            defaultMessage: "Extension Information",
            description: "header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Input
          disabled={disabled}
          error={!!formErrors.name}
          label={intl.formatMessage({
            id: "Crht/3",
            defaultMessage: "Extension Name",
            description: "custom app name",
          })}
          helperText={getAppErrorMessage(formErrors.name, intl)}
          width="100%"
          name="name"
          value={data.name}
          onChange={onChange}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomExtensionInformation.displayName = "CustomExtensionInformation";
