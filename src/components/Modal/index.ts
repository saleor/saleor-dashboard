import { Actions } from "./Actions";
import { Close } from "./Close";
import { Content } from "./Content";
import { Root } from "./Root";
import { Title } from "./Title";

export const DASHBOARD_MODAL_WIDTH = 600;
export const DASHBOARD_MODAL_WIDTH_SMALL = 444;

export const DashboardModal = Object.assign(Root, {
  Title,
  Content,
  Actions,
  Close,
});
