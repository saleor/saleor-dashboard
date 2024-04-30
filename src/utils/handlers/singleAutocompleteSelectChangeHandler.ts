import { SingleAutocompleteChoiceType } from "@dashboard/components/SingleAutocompleteSelectField";
import { FormChange } from "@dashboard/hooks/useForm";

export interface SingleAutocompleteSelectedChangeHandlerProps {
  change: FormChange;
  setSelected: (value: string) => void;
  choices: SingleAutocompleteChoiceType[];
}

function createSingleAutocompleteSelectHandler(
  change: FormChange,
  setSelected: (value: string) => void,
  choices: SingleAutocompleteChoiceType[],
): FormChange {
  return event => {
    change(event);

    const value = event.target.value;
    const choice = choices.find(category => category.value === value);

    setSelected(choice ? choice.label : value);
  };
}

export default createSingleAutocompleteSelectHandler;
