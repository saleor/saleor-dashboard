import SectionRoute from "@dashboard/auth/components/SectionRoute";
import { Route } from "@dashboard/components/Router";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  AppDetailsUrlQueryParams,
  CustomAppDetailsUrlQueryParams,
  ExtensionInstallQueryParams,
  ExtensionsPaths,
  PluginUrlQueryParams,
} from "@dashboard/extensions/urls";
import { ExploreExtensions } from "@dashboard/extensions/views/ExploreExtensions/ExploreExtensions";
import { InstallCustomExtension } from "@dashboard/extensions/views/InstallCustomExtension/InstallCustomExtension";
import { InstalledExtensions } from "@dashboard/extensions/views/InstalledExtensions/InstalledExtensions";
import { PermissionEnum } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import NotFound from "@dashboard/NotFound";
import { parseQs } from "@dashboard/url-utils";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import { useCustomAppToken } from "./hooks/useCustomAppToken";
import { AddCustomExtension } from "./views/AddCustomExtension/AddCustomExtension";
import { AddCustomExtensionWebhook } from "./views/AddCustomExtensionWebhook/AddCustomExtensionWebhook";
import { EditCustomExtension } from "./views/EditCustomExtension";
import { EditCustomExtensionWebhook } from "./views/EditCustomExtensionWebhook/EditCustomExtensionWebhook";
import { EditManifestExtension } from "./views/EditManifestExtension/AppManageView";
import { EditManifestExtensionPermissions } from "./views/EditManifestExtensionPermissions/EditManifestExtensionPermissions";
import { EditPluginExtension } from "./views/EditPluginExtension/EditPluginExtension";
import { ViewManifestExtensionIframe } from "./views/ViewManifestExtension/ViewManifestExtensionIframe";

const ExploreExtensionsView = () => {
  return <ExploreExtensions />;
};

const InstalledExtensionsView = () => {
  const qs = parseQs(location.search.substr(1));
  const params = qs;

  return <InstalledExtensions params={params} />;
};
const InstallCustomExtensionView = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ExtensionInstallQueryParams = qs;

  return <InstallCustomExtension params={params} />;
};

const EditCustomExtensionView = ({
  match,
  token,
  onTokenClose,
}: RouteComponentProps<{ id?: string }> & { token: string; onTokenClose: () => void }) => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomAppDetailsUrlQueryParams = qs;
  const id = match.params.id;

  if (!id) {
    throw new Error("No ID provided");
  }

  return (
    <EditCustomExtension
      id={decodeURIComponent(id)}
      params={params}
      token={token}
      onTokenClose={onTokenClose}
    />
  );
};

const EditManifestExtensionView = ({ match }: RouteComponentProps<{ id: string }>) => {
  const qs = parseQs(location.search.substr(1));
  const params: AppDetailsUrlQueryParams = qs;

  return <EditManifestExtension id={decodeURIComponent(match.params.id)} params={params} />;
};

const ViewManifestExtensionIframeView = ({ match }: RouteComponentProps<{ id: string }>) => {
  return <ViewManifestExtensionIframe id={decodeURIComponent(match.params.id)} />;
};

const EditManifestExtensionPermissionsView = ({ match }: RouteComponentProps<{ id: string }>) => {
  return <EditManifestExtensionPermissions id={decodeURIComponent(match.params.id)} />;
};

const EditPluginExtensionView = ({ match }: RouteComponentProps<{ id: string }>) => {
  const qs = parseQs(location.search.substr(1));
  const params: PluginUrlQueryParams = qs;
  const id = decodeURIComponent(match.params.id);

  if (!id) {
    throw new Error("No ID provided");
  }

  return <EditPluginExtension id={id} params={params} />;
};

const AddCustomExtensionWebhookView = ({ match }: RouteComponentProps<{ appId?: string }>) => {
  const appId = match.params.appId;

  if (!appId) {
    throw new Error("No App ID provided");
  }

  return <AddCustomExtensionWebhook appId={decodeURIComponent(appId)} />;
};

const EditCustomExtensionWebhookView = ({ match }: RouteComponentProps<{ id?: string }>) => {
  const id = match.params.id;

  if (!id) {
    throw new Error("No ID provided");
  }

  return <EditCustomExtensionWebhook id={decodeURIComponent(id)} />;
};

export const ExtensionsSection = () => {
  const intl = useIntl();

  const { customAppToken, setCustomAppToken } = useCustomAppToken();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.extensions)} />
      <Switch>
        <Route exact path={ExtensionsPaths.exploreExtensions} component={ExploreExtensionsView} />
        <Route
          exact
          path={ExtensionsPaths.installedExtensions}
          component={InstalledExtensionsView}
        />
        <SectionRoute
          exact
          permissions={[PermissionEnum.MANAGE_APPS]}
          path={ExtensionsPaths.installCustomExtension}
          component={InstallCustomExtensionView}
        />

        {/* -- Manifest app routes -- */}
        <Route
          exact
          path={ExtensionsPaths.resolveEditManifestExtension(":id")}
          component={EditManifestExtensionView}
        />
        <Route
          exact
          path={ExtensionsPaths.resolveAppRequestPermissionsPath(":id")}
          component={EditManifestExtensionPermissionsView}
        />
        <Route
          path={ExtensionsPaths.resolveViewManifestExtension(":id")}
          component={ViewManifestExtensionIframeView}
        />

        {/* -- Plugin routes -- */}

        <Route
          exact
          path={ExtensionsPaths.resolveEditPluginExtension(":id")}
          component={EditPluginExtensionView}
        />

        {/* -- Custom apps routes -- */}
        <Route
          exact
          path={ExtensionsPaths.addCustomExtension}
          render={() => <AddCustomExtension setToken={setCustomAppToken} />}
        />
        <Route
          exact
          path={ExtensionsPaths.resolveEditCustomExtension(":id")}
          render={props => (
            <EditCustomExtensionView
              {...props}
              token={customAppToken || ""}
              onTokenClose={() => setCustomAppToken(null)}
            />
          )}
        />

        <SectionRoute
          exact
          path={ExtensionsPaths.resolveAddCustomExtensionWebhook(":appId")}
          component={AddCustomExtensionWebhookView}
          permissions={[PermissionEnum.MANAGE_APPS]}
        />
        <SectionRoute
          exact
          path={ExtensionsPaths.resolveEditCustomExtensionWebhook(":appId", ":id")}
          component={EditCustomExtensionWebhookView}
          permissions={[PermissionEnum.MANAGE_APPS]}
        />
        <Route component={NotFound} />
      </Switch>
    </>
  );
};
