import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { FormChange } from "@saleor/hooks/useForm";

function createSingleAutocompleteSelectHandler(
  change: FormChange,
  setSelected: (value: string) => void,
  choices: SingleAutocompleteChoiceType[]
): FormChange {
  return (event: React.ChangeEvent<any>) => {
    change(event);

    const value = event.target.value;
    const choice = choices.find(category => category.value === value);
    setSelected(choice ? choice.label : value);
  };
}

export default createSingleAutocompleteSelectHandler;
