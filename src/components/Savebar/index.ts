import { SavebarRoot, Spacer } from "./Savebar";
import { CancelButton, ConfirmButton, DeleteButton } from "./SavebarActionButtons";
import { ReadOnlyLabel } from "./SavebarReadOnlyLabel";

export const Savebar = Object.assign(SavebarRoot, {
  Spacer,
  DeleteButton,
  ConfirmButton,
  CancelButton,
  ReadOnlyLabel,
});
