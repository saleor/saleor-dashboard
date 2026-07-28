import AttributeDetails from "@dashboard/attributes/components/AttributeDetails";
import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import AttributeProperties from "@dashboard/attributes/components/AttributeProperties";
import { AttributeReferenceTypesSection } from "@dashboard/attributes/components/AttributeReferenceTypesSection/AttributeReferenceTypesSection";
import { AttributeValues } from "@dashboard/attributes/components/AttributeValues/AttributeValues";
import {
  ATTRIBUTE_TYPES_WITH_DEDICATED_VALUES,
  ENTITY_TYPES_WITH_TYPES_RESTRICTION,
  REFERENCE_ATTRIBUTE_TYPES,
} from "@dashboard/attributes/utils/data";
import { type AttributeValueEditDialogFormData } from "@dashboard/attributes/utils/data";
import { type ListSettingsUpdate } from "@dashboard/components/TablePagination";
import {
  type AttributeErrorFragment,
  type AttributeInputTypeEnum,
  type AttributeValueListFragment,
} from "@dashboard/graphql";
import { type FormChange, type UseFormResult } from "@dashboard/hooks/useForm";
import {
  type FetchMoreProps,
  type ListSettings,
  type RelayToFlat,
  type ReorderAction,
} from "@dashboard/types";
import { type Option } from "@saleor/macaw-ui-next";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

export type AttributeCreateFormStep = 1 | 2;

interface AttributeCreateFormContentProps
  extends Pick<
    UseFormResult<AttributePageFormData>,
    "change" | "clearErrors" | "data" | "errors" | "set" | "setError" | "triggerChange"
  > {
  apiErrors: AttributeErrorFragment[];
  disabled: boolean;
  inputType: AttributeInputTypeEnum;
  onEntityTypeChange: FormChange;
  onInlineValueAdd?: (data: AttributeValueEditDialogFormData) => void;
  fetchMoreReferenceTypes?: FetchMoreProps;
  fetchReferenceTypes?: (query: string) => void;
  referenceTypeOptions?: Option[];
  referenceTypesLoading?: boolean;
  onValueDelete: (id: string) => void;
  onValueReorder: ReorderAction;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onNextPage: () => void;
  onPreviousPage: () => void;
  onUpdateListSettings?: ListSettingsUpdate;
  settings?: ListSettings;
  step: AttributeCreateFormStep;
  valueAddError?: AttributeErrorFragment | null;
  values?: RelayToFlat<AttributeValueListFragment>;
}

export const AttributeCreateFormContent = ({
  apiErrors,
  change,
  clearErrors,
  data,
  disabled,
  errors,
  inputType,
  onEntityTypeChange,
  onInlineValueAdd,
  fetchMoreReferenceTypes,
  fetchReferenceTypes,
  referenceTypeOptions = [],
  referenceTypesLoading = false,
  onNextPage,
  onPreviousPage,
  onUpdateListSettings,
  onValueDelete,
  onValueReorder,
  pageInfo,
  settings,
  set,
  setError,
  step,
  triggerChange,
  valueAddError = null,
  values,
}: AttributeCreateFormContentProps) => {
  const showReferenceTypes = data.entityType
    ? REFERENCE_ATTRIBUTE_TYPES.includes(data.inputType) &&
      ENTITY_TYPES_WITH_TYPES_RESTRICTION.includes(data.entityType)
    : false;
  const showValues = ATTRIBUTE_TYPES_WITH_DEDICATED_VALUES.includes(inputType);

  if (step === 1) {
    return (
      <AttributeDetails
        apiErrors={apiErrors}
        canChangeType
        clearErrors={clearErrors}
        data={data}
        disabled={disabled}
        errors={errors}
        onChange={onEntityTypeChange}
        onUnitChange={unit => {
          if ((data.unit ?? null) !== (unit ?? null)) {
            set({ unit });
            triggerChange();
          }
        }}
        setError={setError}
        variant="embedded"
      />
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {showReferenceTypes && fetchReferenceTypes ? (
        <AttributeReferenceTypesSection
          disabled={disabled}
          entityType={data.entityType ?? undefined}
          fetchMore={fetchMoreReferenceTypes}
          fetchOptions={fetchReferenceTypes}
          loading={referenceTypesLoading}
          onChange={event => set({ referenceTypes: event.target.value })}
          options={referenceTypeOptions}
          value={data.referenceTypes}
          variant="embedded"
        />
      ) : null}

      {showValues ? (
        <AttributeValues
          addMode="inline"
          attributeName={data.name}
          disabled={disabled}
          inlineValueAddError={valueAddError}
          inputType={inputType}
          onInlineValueAdd={onInlineValueAdd}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          onUpdateListSettings={onUpdateListSettings}
          onValueAdd={() => undefined}
          onValueDelete={onValueDelete}
          onValueReorder={onValueReorder}
          onValueUpdate={() => undefined}
          pageInfo={pageInfo}
          settings={settings}
          values={values}
          variant="embedded"
        />
      ) : null}

      <AttributeProperties
        errors={apiErrors}
        data={data}
        disabled={disabled}
        onChange={change}
        variant="embedded"
      />

      <Text size={2} color="default2">
        <FormattedMessage {...messages.footerHint} />
      </Text>
    </Box>
  );
};
