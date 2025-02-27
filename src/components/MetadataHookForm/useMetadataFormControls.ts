import { MetadataInput } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { IntlShape, useIntl } from "react-intl";

import { EventDataAction, EventDataField } from "../Metadata/types";
import { getDataKey, parseEventData } from "../Metadata/utils";

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

type MetadataFormData = {
  metadata: MetadataInput[];
  privateMetadata: MetadataInput[];
};

type MetadataFormControlProps = Pick<
  UseFormReturn<MetadataFormData>,
  "getValues" | "control" | "trigger"
>;

export const useMetadataFormControls = ({
  control,
  trigger,
  getValues,
}: MetadataFormControlProps) => {
  const intl = useIntl();
  const metadataControls = useFieldArray<MetadataFormData>({
    control,
    name: "metadata",
    rules: {
      validate: getValidateMetadata(intl),
    },
  });

  const privateMetadataControls = useFieldArray<MetadataFormData>({
    control,
    name: "privateMetadata",
    rules: {
      validate: getValidateMetadata(intl),
    },
  });

  const getHandleChange = ({ type }: { type: "metadata" | "privateMetadata" }) => {
    return (event: ChangeEvent) => {
      const { action, field, fieldIndex, value } = parseEventData(event);

      const metadataType = getDataKey(type === "privateMetadata"); // isPrivate parameter
      const fieldObjKey = field === EventDataField.name ? "key" : "value";
      const calledMetadataControls =
        metadataType === "metadata" ? metadataControls : privateMetadataControls;

      if (action === EventDataAction.update && typeof fieldIndex === "number") {
        // Note: form.setValue cannot be used, because it doesn't trigger a re-render
        const existingValue = getValues(`${metadataType}.${fieldIndex}`);

        calledMetadataControls.update(fieldIndex, { ...existingValue, [fieldObjKey]: value });

        // Trigger re-validation of data
        trigger(metadataType);
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
