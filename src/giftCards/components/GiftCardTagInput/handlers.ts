import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { toggle } from "@saleor/utils/lists";

export const multiAutocompleteSelectChangeTagsHandler = (
  change: (event: ChangeEvent, cb?: () => void) => void,
  tags: MultiAutocompleteChoiceType[],
  values: string[],
  setDisplayValues: (values: string[]) => void
) => (event: ChangeEvent) => {
  //   console.log({ event, tags });
  const events = !!values.length
    ? toggle(
        event.target.value,
        tags.map(({ value }) => value),
        (a, b) => a === b
      )
    : [event.target.value];

  //   console.log({ events });

  setDisplayValues(tags.map(({ value }) => value));

  change({
    target: {
      name: "tags",
      value: events
    }
  });
};
