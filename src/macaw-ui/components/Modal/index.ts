import { Close } from "./Close";
import { Content } from "./Content";
import { Root } from "./Root";
import { Trigger } from "./Trigger";

export type { ModalContentProps } from "./Content";
export type { ModalRootProps } from "./Root";
export type { ModalTriggerProps } from "./Trigger";

export const Modal = Object.assign(Root, { Content, Trigger, Close });
