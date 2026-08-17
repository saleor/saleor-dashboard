import { ATTRIBUTE_TYPES_WITH_CONFIGURABLE_FACED_NAVIGATION } from "@dashboard/attributes/utils/data";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import {
  DetailSettingNestedField,
  DetailSettingToggleRow,
} from "@dashboard/components/DetailSettingToggleRow/DetailSettingToggleRow";
import { type AttributeErrorFragment, AttributeTypeEnum } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getAttributeErrorMessage from "@dashboard/utils/errors/attribute";
import { Input } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { type AttributePageFormData } from "../AttributePage";
import { messages } from "./messages";

interface AttributePropertiesProps {
  data: AttributePageFormData;
  disabled: boolean;
  errors: AttributeErrorFragment[];
  onChange: FormChange;
}

const AttributeProperties = ({
  data,
  errors,
  disabled,
  onChange,
}: AttributePropertiesProps): JSX.Element => {
  const intl = useIntl();
  const formErrors = getFormErrors(["storefrontSearchPosition"], errors);
  const storefrontFacetedNavigationProperties =
    ATTRIBUTE_TYPES_WITH_CONFIGURABLE_FACED_NAVIGATION.includes(data.inputType) &&
    data.type === AttributeTypeEnum.PRODUCT_TYPE;

  const handleToggle =
    (name: keyof AttributePageFormData) =>
    (pressed: boolean): void => {
      onChange({ target: { name, value: pressed } });
    };

  const propertiesContent = (
    <>
      <DetailSettingToggleRow
        title={<FormattedMessage {...messages.valueRequired} />}
        description={<FormattedMessage {...messages.valueRequiredCaption} />}
        pressed={data.valueRequired}
        disabled={disabled}
        testId="attribute-value-required"
        onPressedChange={handleToggle("valueRequired")}
      />

      {storefrontFacetedNavigationProperties && (
        <DetailSettingToggleRow
          title={<FormattedMessage {...messages.filterableInStorefront} />}
          description={<FormattedMessage {...messages.filterableInStorefrontCaption} />}
          pressed={data.filterableInStorefront}
          disabled={disabled}
          testId="attribute-filterable-in-storefront"
          onPressedChange={handleToggle("filterableInStorefront")}
        >
          {data.filterableInStorefront ? (
            <DetailSettingNestedField>
              <Input
                disabled={disabled}
                error={!!formErrors.storefrontSearchPosition}
                width="100%"
                helperText={getAttributeErrorMessage(formErrors.storefrontSearchPosition, intl)}
                name={"storefrontSearchPosition" as keyof AttributePageFormData}
                label={intl.formatMessage(messages.storefrontSearchPosition)}
                value={data.storefrontSearchPosition}
                onChange={onChange}
              />
            </DetailSettingNestedField>
          ) : null}
        </DetailSettingToggleRow>
      )}

      <DetailSettingToggleRow
        title={<FormattedMessage {...messages.visibleInStorefront} />}
        description={<FormattedMessage {...messages.visibleInStorefrontCaption} />}
        pressed={data.visibleInStorefront}
        disabled={disabled}
        testId="attribute-visible-in-storefront"
        onPressedChange={handleToggle("visibleInStorefront")}
      />
    </>
  );

  return (
    <DetailSettingsCard
      title={intl.formatMessage(commonMessages.properties)}
      contentFlush
      data-test-id="attribute-properties"
    >
      {propertiesContent}
    </DetailSettingsCard>
  );
};

AttributeProperties.displayName = "AttributeProperties";
export default AttributeProperties;
