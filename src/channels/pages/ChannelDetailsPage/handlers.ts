import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { FormChange } from "@saleor/hooks/useForm";

export const createSingleAutocompleteSelectHandler = (
  change: FormChange,
  setSelected: (value: string) => void,
  choices: SingleAutocompleteChoiceType[]
): FormChange => (event: React.ChangeEvent<any>) => {
  change(event);

  const value = event.target.value;
  const choice = choices.find(code => code.value === value);

  setSelected(choice ? choice.label : value);
};

export default createSingleAutocompleteSelectHandler;
