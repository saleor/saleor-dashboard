import { Actions } from "./Actions";
import { Close } from "./Close";
import { Content, type ContentSize } from "./Content";
import { Grid } from "./Grid";
import { Header } from "./Header";
import { Root } from "./Root";
import { Title } from "./Title";

export type DashboardModalContentSize = ContentSize;

export const DashboardModal = Object.assign(Root, {
  Title,
  Content,
  Actions,
  Close,
  Grid,
  Header,
});
