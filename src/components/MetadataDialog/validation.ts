import { MetadataInput } from "@dashboard/graphql";
import { IntlShape } from "react-intl";

/**
 * Creates a validation function for metadata entries.
 * Ensures all metadata keys are unique and non-empty.
 *
 * @param intl - React Intl instance for i18n error messages
 * @returns Validation function compatible with react-hook-form
 *
 * @example
 * ```ts
 * const validate = getValidateMetadata(intl);
 * const result = validate([
 *   { key: "color", value: "blue" },
 *   { key: "size", value: "large" }
 * ]);
 * // Returns true if valid, or error message string if invalid
 * ```
 */
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
 * Converts react-hook-form field array entries to MetadataInput format.
 * Removes the 'id' field that react-hook-form adds for internal tracking.
 *
 * @param fields - Field array from useFieldArray (includes 'id' property)
 * @returns Clean MetadataInput array with only key and value
 *
 * @example
 * ```ts
 * const fields = [
 *   { id: "auto-generated-id", key: "color", value: "blue" },
 *   { id: "another-id", key: "size", value: "large" }
 * ];
 *
 * const metadata = mapFieldArrayToMetadataInput(fields);
 * // Returns: [{ key: "color", value: "blue" }, { key: "size", value: "large" }]
 * ```
 */
export const mapFieldArrayToMetadataInput = (
  fields: Array<Record<"id", string> & MetadataInput>,
): MetadataInput[] => {
  return fields.map(field => ({
    key: field.key,
    value: field.value,
  }));
};
