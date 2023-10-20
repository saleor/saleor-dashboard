import { ChangeEvent, FormChange } from "@dashboard/hooks/useForm";
import { Option } from "@saleor/macaw-ui-next";

/**
 * @param change Use toggleValue callback delivered by form
 */
function createMultiselectChangeHandler(
  change: FormChange,
  setSelected: (choices: Option[]) => void,
): FormChange {
  return (event: ChangeEvent<Option[]>) => {
    change(event);
    setSelected(event.target.value);
  };
}

export default createMultiselectChangeHandler;
