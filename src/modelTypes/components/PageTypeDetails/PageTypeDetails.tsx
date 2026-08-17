import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { type PageErrorFragment } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import { Input } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface PageTypeDetailsProps {
  data?: {
    name: string;
  };
  disabled: boolean;
  errors?: PageErrorFragment[];
  onChange: FormChange;
}

const PageTypeDetails = ({
  data,
  disabled,
  errors = [],
  onChange,
}: PageTypeDetailsProps): JSX.Element => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <DetailSettingsCard
      title={intl.formatMessage(commonMessages.generalInformations)}
      data-test-id="page-type-general-information"
    >
      <Input
        disabled={disabled}
        error={!!formErrors.name}
        width="100%"
        helperText={getPageErrorMessage(formErrors.name, intl)}
        label={intl.formatMessage(commonMessages.name)}
        name="name"
        data-test-id="page-type-name"
        onChange={onChange}
        value={data?.name ?? ""}
      />
    </DetailSettingsCard>
  );
};

PageTypeDetails.displayName = "PageTypeDetails";
export default PageTypeDetails;
