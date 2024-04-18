// @ts-strict-ignore
import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import { maybe } from "@dashboard/misc";

import useListActions from "./useListActions";

function useMultiAutocomplete(initial: MultiAutocompleteChoiceType[] = []) {
  const { listElements, toggle } = useListActions<MultiAutocompleteChoiceType>(
    initial,
    (a, b) => a.value === b.value,
  );
  const handleSelect = (event: React.ChangeEvent<any>, choices: MultiAutocompleteChoiceType[]) => {
    const value: string = event.target.value;
    const match = choices.find(choice => choice.value === value);
    toggle({
      label: maybe(() => match.label, value),
      value,
    });
  };

  return {
    change: handleSelect,
    data: listElements,
  };
}

export default useMultiAutocomplete;
