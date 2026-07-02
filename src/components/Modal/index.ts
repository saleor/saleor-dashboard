import { Actions } from "./Actions";
import { Body } from "./Body";
import { Close } from "./Close";
import { Content, type ContentSize } from "./Content";
import { ContextHeader } from "./ContextHeader";
import { Grid } from "./Grid";
import { Header } from "./Header";
import { Inset } from "./Inset";
import { type ModalStep, ModalSteps } from "./ModalSteps";
import { PickerHeader } from "./PickerHeader";
import { Root } from "./Root";
import { Title } from "./Title";
import { MODAL_BODY_INSET_PADDING_BLOCK_SPACING, MODAL_PADDING_SPACING } from "./tokens";

export type DashboardModalContentSize = ContentSize;

export const DashboardModal = Object.assign(Root, {
  Title,
  Content,
  Body,
  Actions,
  Close,
  ContextHeader,
  Grid,
  Header,
  Inset,
  ModalSteps,
  PickerHeader,
});

export type { ModalStep };
export { MODAL_BODY_INSET_PADDING_BLOCK_SPACING, MODAL_PADDING_SPACING };
