import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";

export const getMultiChoices = (
  values: string[],
): MultiAutocompleteChoiceType[] =>
  values.map(tag => ({
    label: tag,
    value: tag,
  }));
