import { MetadataInput } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { useFieldArray, UseFormReturn } from "react-hook-form";

import { EventDataAction, EventDataField } from "../Metadata/types";
import { getDataKey, parseEventData } from "../Metadata/utils";

const validateMetadataDuplicateKeys = (metadata: MetadataInput[]): true | string => {
  const keys = metadata.map(entry => entry.key);
  const uniqueKeys = new Set(keys);

  return uniqueKeys.size !== keys.length
    ? "Metadata keys must be unique, remove duplicate key"
    : true;
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
  const metadataControls = useFieldArray<MetadataFormData>({
    control,
    name: "metadata",
    rules: {
      validate: validateMetadataDuplicateKeys,
    },
  });

  const privateMetadataControls = useFieldArray<MetadataFormData>({
    control,
    name: "privateMetadata",
    rules: {
      validate: validateMetadataDuplicateKeys,
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
    privateMetadataControls: privateMetadataControls.fields,
    handleMetadataChange: getHandleChange({ type: "metadata" }),
    handlePrivateMetadataChange: getHandleChange({ type: "privateMetadata" }),
  } as const;
};
