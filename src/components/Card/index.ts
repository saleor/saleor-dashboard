import { Actions as BottomActions } from "./Actions";
import { Content } from "./Content";
import { Header } from "./Header";
import { Root } from "./Root";
import { CardSubtitle as Subtitle } from "./Subtitle";
import { Title } from "./Title";
import { Toolbar } from "./Toolbar";

export const DashboardCard = Object.assign(Root, {
  Title,
  Content,
  BottomActions,
  Subtitle,
  Header,
  Toolbar,
});
