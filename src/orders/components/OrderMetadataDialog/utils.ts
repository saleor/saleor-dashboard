import { MetadataInput } from "@dashboard/graphql";
import { IntlShape } from "react-intl";

export const getValidateMetadata =
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

/**
 * Maps FieldArrayWithId to MetadataInput by extracting only key and value properties.
 * FieldArrayWithId includes an 'id' field used by react-hook-form for tracking,
 * but MetadataInput only needs key and value.
 */
export const mapFieldArrayToMetadataInput = (
  fields: Array<Record<"id", string> & MetadataInput>,
): MetadataInput[] => {
  return fields.map(field => ({
    key: field.key,
    value: field.value,
  }));
};
