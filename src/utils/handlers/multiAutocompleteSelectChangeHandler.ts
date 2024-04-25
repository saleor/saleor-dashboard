import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import { ChangeEvent, FormChange } from "@dashboard/hooks/useForm";
import { combinedMultiAutocompleteChoices } from "@dashboard/misc";
import { toggle } from "@dashboard/utils/lists";

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

    if (!choice) {
      return;
    }

    setSelected(toggle(choice, selected, (a, b) => a.value === b.value));
  };
}

export default createMultiAutocompleteSelectHandler;
