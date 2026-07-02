import { Actions } from "./Actions";
import { Body } from "./Body";
import { Close } from "./Close";
import { Content, type ContentSize } from "./Content";
import { ContextHeader } from "./ContextHeader";
import { Grid } from "./Grid";
import { Header } from "./Header";
import { type ModalStep, ModalSteps } from "./ModalSteps";
import { Root } from "./Root";
import { Title } from "./Title";

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
  ModalSteps,
});

export type { ModalStep };
