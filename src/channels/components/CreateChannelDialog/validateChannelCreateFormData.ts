import { type ChannelCreateFormData } from "@dashboard/channels/components/CreateChannelDialog/types";
import { ChannelErrorCode, type ChannelErrorFragment } from "@dashboard/graphql";

const createEmptyRequiredError = (field: string): ChannelErrorFragment => ({
  __typename: "ChannelError",
  code: ChannelErrorCode.REQUIRED,
  field,
  message: null,
});

export const validateChannelCreateFormData = (
  data: ChannelCreateFormData,
): ChannelErrorFragment[] => {
  const errors: ChannelErrorFragment[] = [];

  if (!data.name.trim()) {
    errors.push(createEmptyRequiredError("name"));
  }

  if (!data.slug.trim()) {
    errors.push(createEmptyRequiredError("slug"));
  }

  if (!data.currencyCode) {
    errors.push(createEmptyRequiredError("currencyCode"));
  }

  if (!data.defaultCountry) {
    errors.push(createEmptyRequiredError("defaultCountry"));
  }

  return errors;
};
