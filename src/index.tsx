import "@saleor/macaw-ui-next/style";
import "./index.css";

import { ApolloProvider } from "@apollo/client";
import { history, Route, Router } from "@dashboard/components/Router";
import { AppExtensionPopupProvider } from "@dashboard/extensions/components/AppExtensionContext/AppExtensionContextProvider";
import { ExtensionsPaths, extensionsSection } from "@dashboard/extensions/urls";
import { PermissionEnum } from "@dashboard/graphql";
import useAppState from "@dashboard/hooks/useAppState";
import { pageListPath } from "@dashboard/modeling/urls";
import { modelTypesPath } from "@dashboard/modelTypes/urls";
import { refundsSettingsPath } from "@dashboard/refundsSettings/urls";
import { structuresListPath } from "@dashboard/structures/urls";
import { ThemeProvider } from "@dashboard/theme";
import { OnboardingProvider } from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { SaleorProvider } from "@saleor/sdk";
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import TagManager from "react-gtm-module";
import { useIntl } from "react-intl";
import { Redirect, Switch } from "react-router-dom";

import { attributeSection } from "./attributes/urls";
import AuthProvider from "./auth/AuthProvider";
import LoginLoading from "./auth/components/LoginLoading/LoginLoading";
import SectionRoute from "./auth/components/SectionRoute";
import { useAuthRedirection } from "./auth/hooks/useAuthRedirection";
import { channelsSection } from "./channels/urls";
import AppLayout from "./components/AppLayout";
import useAppChannel, { AppChannelProvider } from "./components/AppLayout/AppChannelContext";
import { DateProvider } from "./components/Date";
import { DevModeProvider } from "./components/DevModePanel/DevModeProvider";
import ErrorPage from "./components/ErrorPage";
import ExitFormDialogProvider from "./components/Form/ExitFormDialogProvider";
import { legacyRedirects } from "./components/LegacyRedirects";
import { LocaleProvider } from "./components/Locale";
import MessageManagerProvider from "./components/messages";
import { NavigatorSearchProvider } from "./components/NavigatorSearch/NavigatorSearchProvider";
import { ProductAnalytics } from "./components/ProductAnalytics";
import { SavebarRefProvider } from "./components/Savebar/SavebarRefContext";
import { ShopProvider } from "./components/Shop";
import { WindowTitle } from "./components/WindowTitle";
import { GTM_ID } from "./config";
import { getConfigMenuItemsPermissions } from "./configuration/utils";
import AppStateProvider from "./containers/AppState";
import BackgroundTasksProvider from "./containers/BackgroundTasks";
import { FeatureFlagsProviderWithUser } from "./featureFlags/FeatureFlagsProvider";
import { giftCardsSectionUrlName } from "./giftCards/urls";
import { apolloClient, saleorClient } from "./graphql/client";
import { useLocationState } from "./hooks/useLocationState";
import { commonMessages } from "./intl";
import { NotFound } from "./NotFound";
import { errorTracker } from "./services/errorTracking";
import { paletteOverrides, themeOverrides } from "./themeOverrides";
import { warehouseSection } from "./warehouses/urls";

// Lazy-loaded page sections for code splitting
const AttributeSection = lazy(() => import("./attributes"));
const Auth = lazy(() => import("./auth"));
const CategorySection = lazy(() => import("./categories"));
const ChannelsSection = lazy(() => import("./channels"));
const CollectionSection = lazy(() => import("./collections"));
const CustomerSection = lazy(() =>
  import("./customers").then(m => ({ default: m.CustomerSection })),
);
const DiscountSection = lazy(() => import("./discounts"));
const ExtensionsSection = lazy(() =>
  import("./extensions").then(m => ({ default: m.ExtensionsSection })),
);
const GiftCardSection = lazy(() => import("./giftCards"));
const PageSection = lazy(() => import("./modeling"));
const PageTypesSection = lazy(() => import("./modelTypes"));
const OrdersSection = lazy(() => import("./orders"));
const PermissionGroupSection = lazy(() => import("./permissionGroups"));
const ProductSection = lazy(() => import("./products"));
const ProductTypesSection = lazy(() => import("./productTypes"));
const SearchSection = lazy(() => import("./search"));
const ShippingSection = lazy(() => import("./shipping"));
const SiteSettingsSection = lazy(() => import("./siteSettings"));
const StaffSection = lazy(() => import("./staff"));
const NavigationSection = lazy(() => import("./structures"));
const TaxesSection = lazy(() => import("./taxes"));
const TranslationsSection = lazy(() => import("./translations"));
const WarehouseSection = lazy(() => import("./warehouses"));
const ConfigurationSection = lazy(() => import("./configuration"));
const WelcomePage = lazy(() => import("./welcomePage").then(m => ({ default: m.WelcomePage })));
const RefundsSettingsRoute = lazy(() =>
  import("./refundsSettings/route").then(m => ({ default: m.RefundsSettingsRoute })),
);

if (GTM_ID) {
  TagManager.initialize({ gtmId: GTM_ID });
}

errorTracker.init(history);

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

const App = () => (
  // @ts-expect-error legacy types
  <SaleorProvider client={saleorClient}>
    <ApolloProvider client={apolloClient}>
      <Router>
        {/* @ts-expect-error legacy types */}
        <LegacyThemeProvider overrides={themeOverrides} palettes={paletteOverrides}>
          <ThemeProvider>
            <DateProvider>
              <LocaleProvider>
                <MessageManagerProvider>
                  <BackgroundTasksProvider>
                    <AppStateProvider>
                      <AuthProvider>
                        <ProductAnalytics>
                          <ShopProvider>
                            <AppChannelProvider>
                              <ExitFormDialogProvider>
                                <DevModeProvider>
                                  <NavigatorSearchProvider>
                                    <SavebarRefProvider>
                                      <FeatureFlagsProviderWithUser>
                                        <OnboardingProvider>
                                          <Routes />
                                        </OnboardingProvider>
                                      </FeatureFlagsProviderWithUser>
                                    </SavebarRefProvider>
                                  </NavigatorSearchProvider>
                                </DevModeProvider>
                              </ExitFormDialogProvider>
                            </AppChannelProvider>
                          </ShopProvider>
                        </ProductAnalytics>
                      </AuthProvider>
                    </AppStateProvider>
                  </BackgroundTasksProvider>
                </MessageManagerProvider>
              </LocaleProvider>
            </DateProvider>
          </ThemeProvider>
        </LegacyThemeProvider>
      </Router>
    </ApolloProvider>
  </SaleorProvider>
);
const Routes = () => {
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
      {homePageLoaded ? (
        <AppExtensionPopupProvider>
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
                <ErrorPage onBack={resetErrorBoundary} onRefresh={() => window.location.reload()} />
              )}
            >
              <Suspense fallback={<LoginLoading />}>
                <Switch>
                  {legacyRedirects}
                  <SectionRoute exact path="/" component={WelcomePage} />
                  <SectionRoute
                    permissions={[
                      PermissionEnum.MANAGE_PRODUCTS,
                      PermissionEnum.MANAGE_ORDERS,
                      PermissionEnum.MANAGE_PAGES,
                      PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
                    ]}
                    matchPermission="any"
                    path="/search"
                    component={SearchSection}
                  />
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
                    path={pageListPath}
                    component={PageSection}
                  />
                  <SectionRoute
                    permissions={[
                      PermissionEnum.MANAGE_PAGES,
                      PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
                    ]}
                    path={modelTypesPath}
                    component={PageTypesSection}
                    matchPermission="any"
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
                    permissions={[PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES]}
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
                  <SectionRoute
                    permissions={[PermissionEnum.MANAGE_SETTINGS]}
                    path={refundsSettingsPath}
                    component={RefundsSettingsRoute}
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
                    path={structuresListPath}
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
                    permissions={[]}
                    path={extensionsSection}
                    component={ExtensionsSection}
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
                  <Redirect to={ExtensionsPaths.installedExtensions} path={"/apps"} />
                  <Redirect to={ExtensionsPaths.installedExtensions} path="/custom-apps/" />
                  <Redirect to={ExtensionsPaths.installedExtensions} path="/plugins" />
                  <Route component={NotFound} />
                </Switch>
              </Suspense>
            </ErrorBoundary>
          </AppLayout>
        </AppExtensionPopupProvider>
      ) : homePageLoading ? (
        <LoginLoading />
      ) : (
        <Suspense fallback={<LoginLoading />}>
          <Auth />
        </Suspense>
      )}
    </>
  );
};

const root = createRoot(document.querySelector("#dashboard-app")!);

// StrictMode is development-only (no effect in production)
// Set VITE_DISABLE_STRICT_MODE=true to disable for testing
const enableStrictMode = import.meta.env.DEV && import.meta.env.VITE_DISABLE_STRICT_MODE !== "true";

root.render(
  enableStrictMode ? (
    <StrictMode>
      <App />
    </StrictMode>
  ) : (
    <App />
  ),
);
