import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { ChangeEvent, FormChange } from "@saleor/hooks/useForm";
import { combinedMultiAutocompleteChoices } from "@saleor/misc";
import { toggle } from "@saleor/utils/lists";

/**
 * @param change Use toggleValue callback delivered by form
 */
function createMultiAutocompleteSelectHandler(
  change: FormChange,
  setSelected: (choices: MultiAutocompleteChoiceType[]) => void,
  selected: MultiAutocompleteChoiceType[],
  choices: MultiAutocompleteChoiceType[],
): FormChange {
  return (event: ChangeEvent) => {
    change(event);

    const combinedChoices = combinedMultiAutocompleteChoices(selected, choices);

    const id = event.target.value;
    const choice = combinedChoices.find(choice => choice.value === id);

    setSelected(toggle(choice, selected, (a, b) => a.value === b.value));
  };
}

export default createMultiAutocompleteSelectHandler;
