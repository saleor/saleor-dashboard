import { FormChange } from "@dashboard/hooks/useForm";
import { Option } from "@saleor/macaw-ui-next";

export interface SingleAutocompleteSelectedChangeHandlerProps {
  change: FormChange;
  setSelected: (value: string) => void;
  choices: Option[];
}

function createSingleAutocompleteSelectHandler(
  change: FormChange,
  setSelected: (value: string) => void,
  choices: Option[],
): FormChange {
  return event => {
    change(event);

    const value = event.target.value;
    const choice = choices.find(category => category.value === value);

    setSelected(choice ? choice.label : value);
  };
}

export default createSingleAutocompleteSelectHandler;
