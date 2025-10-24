import { MetadataInput } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { FieldArrayPath, useFieldArray, UseFormReturn } from "react-hook-form";
import { IntlShape, useIntl } from "react-intl";

import { EventDataAction, EventDataField } from "../../../components/Metadata/types";
import { getDataKey, parseEventData } from "../../../components/Metadata/utils";
import { OrderAndVariantMetadataFormData } from "./OrderMetadataDialog";

type MetadataFieldPath =
  | "orderLine.metadata"
  | "orderLine.privateMetadata"
  | "variant.metadata"
  | "variant.privateMetadata";

const getValidateMetadata =
  (intl: IntlShape) =>
  (metadata: MetadataInput[]): true | string => {
    const keys = metadata.map(entry => entry.key);
    const uniqueKeys = new Set(keys);

    if (uniqueKeys.size !== keys.length) {
      return intl.formatMessage({
        defaultMessage: "Metadata keys must be unique, remove duplicate key",
        description: "metadata edit form, error message",
        id: "MfWHGz",
      });
    }

    if (keys.some(key => key === "")) {
      return intl.formatMessage({
        defaultMessage: "Metadata key cannot be empty",
        description: "metadata edit form, error message",
        id: "lb5uDM",
      });
    }

    return true;
  };

type MetadataFormControlProps = Pick<
  UseFormReturn<OrderAndVariantMetadataFormData>,
  "getValues" | "control" | "trigger"
> & {
  fieldPrefix: "orderLine" | "variant";
};

export const useNestedMetadataFormControls = ({
  control,
  trigger,
  getValues,
  fieldPrefix,
}: MetadataFormControlProps) => {
  const intl = useIntl();
  const metadataFieldName =
    `${fieldPrefix}.metadata` as FieldArrayPath<OrderAndVariantMetadataFormData>;
  const privateMetadataFieldName =
    `${fieldPrefix}.privateMetadata` as FieldArrayPath<OrderAndVariantMetadataFormData>;

  const metadataControls = useFieldArray<OrderAndVariantMetadataFormData>({
    control,
    name: metadataFieldName,
    rules: {
      validate: getValidateMetadata(intl),
    },
  });

  const privateMetadataControls = useFieldArray<OrderAndVariantMetadataFormData>({
    control,
    name: privateMetadataFieldName,
    rules: {
      validate: getValidateMetadata(intl),
    },
  });

  // Ensure fields are always arrays (never undefined)
  const safeMetadataFields = metadataControls.fields ?? [];
  const safePrivateMetadataFields = privateMetadataControls.fields ?? [];

  const getHandleChange = ({ type }: { type: "metadata" | "privateMetadata" }) => {
    return (event: ChangeEvent) => {
      const { action, field, fieldIndex, value } = parseEventData(event);

      const metadataType = getDataKey(type === "privateMetadata"); // isPrivate parameter
      const fieldObjKey = field === EventDataField.name ? "key" : "value";
      const calledMetadataControls =
        metadataType === "metadata" ? metadataControls : privateMetadataControls;

      if (action === EventDataAction.update && typeof fieldIndex === "number") {
        // Note: form.setValue cannot be used, because it doesn't trigger a re-render
        // Get the existing value at the specific index in the field array
        // Dynamic path is necessary for nested arrays but not fully type-safe
        const existingValue = getValues(
          `${fieldPrefix}.${metadataType}.${fieldIndex}` as never,
        ) as MetadataInput & { id: string };

        // Update the field with the new value while preserving other properties
        calledMetadataControls.update(fieldIndex, {
          ...existingValue,
          [fieldObjKey]: value,
        });

        // Trigger re-validation of data at the parent path
        trigger(`${fieldPrefix}.${metadataType}` as MetadataFieldPath);
      }

      if (action === EventDataAction.add) {
        calledMetadataControls.append({ key: "", value: "" });
      }

      if (action === EventDataAction.delete && typeof fieldIndex === "number") {
        calledMetadataControls.remove(fieldIndex);
      }
    };
  };

  return {
    metadataFields: metadataControls.fields,
    privateMetadataFields: privateMetadataControls.fields,
    handleMetadataChange: getHandleChange({ type: "metadata" }),
    handlePrivateMetadataChange: getHandleChange({ type: "privateMetadata" }),
  } as const;
};
