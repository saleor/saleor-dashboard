import { ChangeEventHandler, FormEventHandler } from "react";

// There is mismatch between desert box onChange type and downshift on change event
export const formEventTypeAdapter = (
  event: ChangeEventHandler<Element>
): FormEventHandler => {
  return event;
};
