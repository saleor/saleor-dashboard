import { Route } from "@dashboard/components/Router";
import { Switch } from "react-router-dom";

import {
  logCallPath,
  manualExchangeDetailPath,
  manualExchangeListPath,
  manualExchangeNewOrderPath,
  manualExchangeNewPath,
  manualExchangeNewSizePath,
  notificationSettingsPath,
  requestDetailPath,
  returnsQueuePath,
  sizeSelectionPath,
} from "./urls";
import { LogCallView } from "./views/LogCallView";
import { ManualExchangeDetailView } from "./views/ManualExchangeDetailView";
import { ManualExchangeListView } from "./views/ManualExchangeListView";
import { ManualExchangeNewView } from "./views/ManualExchangeNewView";
import { NotificationSettingsView } from "./views/NotificationSettingsView";
import { RequestDetailView } from "./views/RequestDetailView";
import { ReturnsQueueView } from "./views/ReturnsQueueView";
import { SizeSelectionView } from "./views/SizeSelectionView";

const ReturnsExchangeSection = () => (
  <Switch>
    {/* Returns queue */}
    <Route exact path={returnsQueuePath} component={ReturnsQueueView} />

    {/* Log call — must come before requestDetailPath to avoid partial match */}
    <Route
      exact
      path={logCallPath(":requestId")}
      render={({ match }) => <LogCallView requestId={match.params.requestId!} />}
    />

    {/* Size selection / exchange */}
    <Route
      exact
      path={sizeSelectionPath(":requestId")}
      render={({ match }) => <SizeSelectionView requestId={match.params.requestId!} />}
    />

    {/* Request detail */}
    <Route
      exact
      path={requestDetailPath(":requestId")}
      render={({ match }) => <RequestDetailView requestId={match.params.requestId!} />}
    />

    {/* Manual exchange — new (size step) */}
    <Route
      exact
      path={manualExchangeNewSizePath(":orderId", ":variantSku")}
      render={({ match }) => (
        <ManualExchangeNewView
          orderId={match.params.orderId!}
          variantSku={match.params.variantSku!}
        />
      )}
    />

    {/* Manual exchange — new (order lookup / item select) */}
    <Route
      path={manualExchangeNewOrderPath(":orderId")}
      render={({ match }) => <ManualExchangeNewView orderId={match.params.orderId!} />}
    />

    {/* Manual exchange — new (blank) */}
    <Route exact path={manualExchangeNewPath} component={ManualExchangeNewView} />

    {/* Manual exchange — detail */}
    <Route
      exact
      path={manualExchangeDetailPath(":mxId")}
      render={({ match }) => <ManualExchangeDetailView mxId={match.params.mxId!} />}
    />

    {/* Manual exchange list */}
    <Route exact path={manualExchangeListPath} component={ManualExchangeListView} />

    {/* Notification settings */}
    <Route exact path={notificationSettingsPath} component={NotificationSettingsView} />
  </Switch>
);

export default ReturnsExchangeSection;
