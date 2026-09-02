import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { type ModelTypeIcon } from "@dashboard/components/ModelTypeIcon/constants";
import { ModelTypeIconPicker } from "@dashboard/components/ModelTypeIcon/ModelTypeIconPicker";
import { type PageErrorFragment } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import { Box, Input } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface PageTypeDetailsProps {
  data?: {
    name: string;
    icon: ModelTypeIcon | null;
  };
  disabled: boolean;
  errors?: PageErrorFragment[];
  onChange: FormChange;
  onIconChange: (icon: ModelTypeIcon | null) => void;
}

const PageTypeDetails = ({
  data,
  disabled,
  errors = [],
  onChange,
  onIconChange,
}: PageTypeDetailsProps): JSX.Element => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <DetailSettingsCard
      title={intl.formatMessage(commonMessages.generalInformations)}
      data-test-id="page-type-general-information"
    >
      {/* The icon sits with the name because the two together are what identifies a model type
          everywhere it is listed. */}
      <Box display="flex" gap={2}>
        <ModelTypeIconPicker
          value={data?.icon ?? null}
          disabled={disabled}
          onChange={onIconChange}
        />
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
      </Box>
    </DetailSettingsCard>
  );
};

PageTypeDetails.displayName = "PageTypeDetails";
export default PageTypeDetails;
