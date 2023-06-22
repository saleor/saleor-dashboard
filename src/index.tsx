// @ts-strict-ignore
import "@saleor/macaw-ui/next/style";
import "./index.css";

import { ApolloProvider } from "@apollo/client";
import DemoBanner from "@dashboard/components/DemoBanner";
import { PermissionEnum } from "@dashboard/graphql";
import useAppState from "@dashboard/hooks/useAppState";
import { ThemeProvider } from "@dashboard/theme";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { SaleorProvider } from "@saleor/sdk";
import React, { useEffect } from "react";
import { render } from "react-dom";
import { ErrorBoundary } from "react-error-boundary";
import TagManager from "react-gtm-module";
import { useIntl } from "react-intl";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { ExternalAppProvider } from "./apps/components/ExternalAppContext";
import { AppSections } from "./apps/urls";
import { attributeSection } from "./attributes/urls";
import AuthProvider from "./auth/AuthProvider";
import LoginLoading from "./auth/components/LoginLoading/LoginLoading";
import SectionRoute from "./auth/components/SectionRoute";
import { useAuthRedirection } from "./auth/hooks/useAuthRedirection";
import { channelsSection } from "./channels/urls";
import AppLayout from "./components/AppLayout";
import useAppChannel, {
  AppChannelProvider,
} from "./components/AppLayout/AppChannelContext";
import { DateProvider } from "./components/Date";
import { DevModeProvider } from "./components/DevModePanel/DevModeProvider";
import ExitFormDialogProvider from "./components/Form/ExitFormDialogProvider";
import { LocaleProvider } from "./components/Locale";
import MessageManagerProvider from "./components/messages";
import { ShopProvider } from "./components/Shop";
import { WindowTitle } from "./components/WindowTitle";
import { DEMO_MODE, getAppMountUri, GTM_ID } from "./config";
import { getConfigMenuItemsPermissions } from "./configuration/utils";
import AppStateProvider from "./containers/AppState";
import BackgroundTasksProvider from "./containers/BackgroundTasks";
import ServiceWorker from "./containers/ServiceWorker/ServiceWorker";
import { CustomAppSections } from "./custom-apps/urls";
import { giftCardsSectionUrlName } from "./giftCards/urls";
import { apolloClient, saleorClient } from "./graphql/client";
import { FlagsServiceProvider } from "./hooks/useFlags/flagsService";
import { useLocationState } from "./hooks/useLocationState";
import { commonMessages } from "./intl";
import { navigationSection } from "./navigation/urls";
import errorTracker from "./services/errorTracking";
import { paletteOverrides, themeOverrides } from "./themeOverrides";
import { warehouseSection } from "./warehouses/urls";

interface PreloadableComponent extends React.ExoticComponent<any> {
  preload: () => Promise<{ default: React.ComponentType<any> }>;
}

const ReactLazyPreload = (
  importStatement: () => Promise<{ default: React.ComponentType<any> }>,
): PreloadableComponent => {
  const Component = React.lazy(importStatement) as any as PreloadableComponent;
  Component.preload = importStatement;
  return Component;
};

const HomePage = ReactLazyPreload(() => import("./home"));
const CategorySection = ReactLazyPreload(() => import("./categories"));
const CollectionSection = ReactLazyPreload(() => import("./collections"));
const CustomerSection = ReactLazyPreload(() => import("./customers"));
const GiftCardSection = ReactLazyPreload(() => import("./giftCards"));
const DiscountSection = ReactLazyPreload(() => import("./discounts"));
const PageSection = ReactLazyPreload(() => import("./pages"));
const PageTypesSection = ReactLazyPreload(() => import("./pageTypes"));
const PluginsSection = ReactLazyPreload(() => import("./plugins"));
const OrdersSection = ReactLazyPreload(() => import("./orders"));
export const ProductSection = ReactLazyPreload(() => import("./products"));
const ProductTypesSection = ReactLazyPreload(() => import("./productTypes"));
const PermissionGroupSection = ReactLazyPreload(
  () => import("./permissionGroups"),
);
const SiteSettingsSection = ReactLazyPreload(() => import("./siteSettings"));
const ShippingSection = ReactLazyPreload(() => import("./shipping"));
const TranslationsSection = ReactLazyPreload(() => import("./translations"));
const NavigationSection = ReactLazyPreload(() => import("./navigation"));
const AttributeSection = ReactLazyPreload(() => import("./attributes"));
const AppsSection = ReactLazyPreload(() => import("./apps"));
const WarehouseSection = ReactLazyPreload(() => import("./warehouses"));
const ChannelsSection = ReactLazyPreload(() => import("./channels"));
const ConfigurationSection = ReactLazyPreload(() => import("./configuration"));
const CustomAppsSection = ReactLazyPreload(() => import("./custom-apps"));
const NotFound = ReactLazyPreload(() => import("./NotFound"));
const Auth = ReactLazyPreload(() => import("./auth"));
const ErrorPage = ReactLazyPreload(() => import("./components/ErrorPage"));
const StaffSection = ReactLazyPreload(() => import("./staff"));
const TaxesSection = ReactLazyPreload(() => import("./taxes"));

if (process.env.GTM_ID) {
  TagManager.initialize({ gtmId: GTM_ID });
}

errorTracker.init();

/*
  Handle legacy theming toggle. Since we use new and old macaw,
  we need to handle both theme swticher for a while.
*/
const handleLegacyTheming = () => {
  const activeTheme = localStorage.getItem("activeMacawUITheme");

  if (activeTheme === "defaultDark") {
    localStorage.setItem("macaw-ui-theme", "dark");
    return;
  }

  localStorage.setItem("macaw-ui-theme", "light");
};

handleLegacyTheming();

const App: React.FC = () => {
  useEffect(() => {
    HomePage.preload();
    CategorySection.preload();
    CollectionSection.preload();
    CustomerSection.preload();
    DiscountSection.preload();
    GiftCardSection.preload();
    OrdersSection.preload();
    PageSection.preload();
    PageTypesSection.preload();
    PluginsSection.preload();
    ProductSection.preload();
    ProductTypesSection.preload();
    PermissionGroupSection.preload();
    SiteSettingsSection.preload();
    ShippingSection.preload();
    TranslationsSection.preload();
    NavigationSection.preload();
    AttributeSection.preload();
    AppsSection.preload();
    WarehouseSection.preload();
    ChannelsSection.preload();
    ConfigurationSection.preload();
    CustomAppsSection.preload();
    NotFound.preload();
    Auth.preload();
    StaffSection.preload();
    TaxesSection.preload();
  }, []);

  return (
    <SaleorProvider client={saleorClient}>
      <ApolloProvider client={apolloClient}>
        <BrowserRouter basename={getAppMountUri()}>
          <LegacyThemeProvider
            overrides={themeOverrides}
            palettes={paletteOverrides}
          >
            <ThemeProvider>
              <DateProvider>
                <LocaleProvider>
                  <MessageManagerProvider>
                    <ServiceWorker />
                    <BackgroundTasksProvider>
                      <AppStateProvider>
                        <FlagsServiceProvider>
                          <AuthProvider>
                            <ShopProvider>
                              <AppChannelProvider>
                                <ExternalAppProvider>
                                  <ExitFormDialogProvider>
                                    <DevModeProvider>
                                      <Routes />
                                    </DevModeProvider>
                                  </ExitFormDialogProvider>
                                </ExternalAppProvider>
                              </AppChannelProvider>
                            </ShopProvider>
                          </AuthProvider>
                        </FlagsServiceProvider>
                      </AppStateProvider>
                    </BackgroundTasksProvider>
                  </MessageManagerProvider>
                </LocaleProvider>
              </DateProvider>
            </ThemeProvider>
          </LegacyThemeProvider>
        </BrowserRouter>
      </ApolloProvider>
    </SaleorProvider>
  );
};

const Routes: React.FC = () => {
  const intl = useIntl();
  const [, dispatchAppState] = useAppState();
  const { authenticated, authenticating } = useAuthRedirection();

  const { channel } = useAppChannel(false);

  const channelLoaded = typeof channel !== "undefined";

  const homePageLoaded = channelLoaded && authenticated;

  const homePageLoading = (authenticated && !channelLoaded) || authenticating;

  const { isAppPath } = useLocationState();

  return (
    <>
      <WindowTitle title={intl.formatMessage(commonMessages.dashboard)} />
      {DEMO_MODE && <DemoBanner />}
      {homePageLoaded ? (
        <AppLayout fullSize={isAppPath}>
          <ErrorBoundary
            onError={e => {
              const errorId = errorTracker.captureException(e);

              dispatchAppState({
                payload: {
                  error: "unhandled",
                  errorId,
                },
                type: "displayError",
              });
            }}
            fallbackRender={({ resetErrorBoundary }) => (
              <ErrorPage
                onBack={resetErrorBoundary}
                onRefresh={() => window.location.reload()}
              />
            )}
          >
            <React.Suspense fallback={<LoginLoading />}>
              <Switch>
                <SectionRoute exact path="/" component={HomePage} />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                  path="/categories"
                  component={CategorySection}
                />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                  path="/collections"
                  component={CollectionSection}
                />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_USERS]}
                  path="/customers"
                  component={CustomerSection}
                />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_GIFT_CARD]}
                  path={giftCardsSectionUrlName}
                  component={GiftCardSection}
                />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_DISCOUNTS]}
                  path="/discounts"
                  component={DiscountSection}
                />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_PAGES]}
                  path="/pages"
                  component={PageSection}
                />
                <SectionRoute
                  permissions={[
                    PermissionEnum.MANAGE_PAGES,
                    PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
                  ]}
                  path="/page-types"
                  component={PageTypesSection}
                  matchPermission="any"
                />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_PLUGINS]}
                  path="/plugins"
                  component={PluginsSection}
                />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_ORDERS]}
                  path="/orders"
                  component={OrdersSection}
                />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                  path="/products"
                  component={ProductSection}
                />
                <SectionRoute
                  permissions={[
                    PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
                  ]}
                  path="/product-types"
                  component={ProductTypesSection}
                />
                <SectionRoute path="/staff" component={StaffSection} />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_STAFF]}
                  path="/permission-groups"
                  component={PermissionGroupSection}
                />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_SETTINGS]}
                  path="/site-settings"
                  component={SiteSettingsSection}
                />
                <SectionRoute path="/taxes" component={TaxesSection} />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_SHIPPING]}
                  path="/shipping"
                  component={ShippingSection}
                />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_TRANSLATIONS]}
                  path="/translations"
                  component={TranslationsSection}
                />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_MENUS]}
                  path={navigationSection}
                  component={NavigationSection}
                />
                <SectionRoute
                  permissions={[
                    PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
                    PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
                  ]}
                  path={attributeSection}
                  component={AttributeSection}
                  matchPermission="any"
                />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_APPS]}
                  path={AppSections.appsSection}
                  component={AppsSection}
                />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                  path={warehouseSection}
                  component={WarehouseSection}
                />
                <SectionRoute
                  permissions={[PermissionEnum.MANAGE_CHANNELS]}
                  path={channelsSection}
                  component={ChannelsSection}
                />
                <SectionRoute
                  matchPermission="any"
                  permissions={getConfigMenuItemsPermissions(intl)}
                  exact
                  path="/configuration"
                  component={ConfigurationSection}
                />
                <SectionRoute
                  path={CustomAppSections.appsSection}
                  component={CustomAppsSection}
                />
                <Route component={NotFound} />
              </Switch>
            </React.Suspense>
          </ErrorBoundary>
        </AppLayout>
      ) : homePageLoading ? (
        <LoginLoading />
      ) : (
        <React.Suspense fallback={<LoginLoading />}>
          <Auth />
        </React.Suspense>
      )}
    </>
  );
};

render(<App />, document.querySelector("#dashboard-app"));
