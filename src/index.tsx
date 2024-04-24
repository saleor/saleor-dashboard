import "@saleor/macaw-ui-next/style";
import "./index.css";

import { ApolloProvider } from "@apollo/client";
import DemoBanner from "@dashboard/components/DemoBanner";
import { PermissionEnum } from "@dashboard/graphql";
import useAppState from "@dashboard/hooks/useAppState";
import { ThemeProvider } from "@dashboard/theme";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { Box, Spinner } from "@saleor/macaw-ui-next";
import { SaleorProvider } from "@saleor/sdk";
import React, { Suspense } from "react";
import { render } from "react-dom";
import { ErrorBoundary } from "react-error-boundary";
import TagManager from "react-gtm-module";
import { useIntl } from "react-intl";
import { BrowserRouter, Route, Routes as RRRRoutes } from "react-router-dom";

import { AppsSectionRoot } from "./apps";
import { ExternalAppProvider } from "./apps/components/ExternalAppContext";
import { AppSections } from "./apps/urls";
import AttributeSection from "./attributes";
import { attributeSection } from "./attributes/urls";
import Auth from "./auth";
import AuthProvider from "./auth/AuthProvider";
import LoginLoading from "./auth/components/LoginLoading/LoginLoading";
import { useAuthRedirection } from "./auth/hooks/useAuthRedirection";
import ChannelsSection from "./channels";
import { channelsSection } from "./channels/urls";
import AppLayout from "./components/AppLayout";
import useAppChannel, {
  AppChannelProvider,
} from "./components/AppLayout/AppChannelContext";
import { DateProvider } from "./components/Date";
import { DevModeProvider } from "./components/DevModePanel/DevModeProvider";
import ErrorPage from "./components/ErrorPage";
import ExitFormDialogProvider from "./components/Form/ExitFormDialogProvider";
import { LocaleProvider } from "./components/Locale";
import MessageManagerProvider from "./components/messages";
import { NavigatorSearchProvider } from "./components/NavigatorSearch/NavigatorSearchProvider";
import { ProductAnalytics } from "./components/ProductAnalytics";
import { ShopProvider } from "./components/Shop";
import { WindowTitle } from "./components/WindowTitle";
import { DEMO_MODE, getAppMountUri, GTM_ID } from "./config";
import ConfigurationSection from "./configuration";
import { getConfigMenuItemsPermissions } from "./configuration/utils";
import AppStateProvider from "./containers/AppState";
import BackgroundTasksProvider from "./containers/BackgroundTasks";
import CustomAppsSection from "./custom-apps";
import { CustomAppSections } from "./custom-apps/urls";
import { FeatureFlagsProviderWithUser } from "./featureFlags/FeatureFlagsProvider";
import { giftCardsSectionUrlName } from "./giftCards/urls";
import { apolloClient, saleorClient } from "./graphql/client";
import { useLocationState } from "./hooks/useLocationState";
import { commonMessages } from "./intl";
import NavigationSection from "./navigation";
import { navigationSection } from "./navigation/urls";
import { NotFound } from "./NotFound";
import errorTracker from "./services/errorTracking";
import { paletteOverrides, themeOverrides } from "./themeOverrides";
import TranslationsSection from "./translations";
import WarehouseSection from "./warehouses";
import { warehouseSection } from "./warehouses/urls";
import SectionRoute, {
  PermissionBasedRoute,
} from "./auth/components/SectionRoute";

const HomePage = React.lazy(() => import("./home"));
const CategorySection = React.lazy(() => import("./categories"));
const CollectionSection = React.lazy(() => import("./collections"));
// @ts-ignore
const CustomerSection = React.lazy(() =>
  import("./customers").then(m => m.CustomerSection),
);
const DiscountSection = React.lazy(() => import("./discounts"));
const GiftCardSection = React.lazy(() => import("./giftCards"));
const OrdersSection = React.lazy(() => import("./orders"));
const PageSection = React.lazy(() => import("./pages"));
const PageTypesSection = React.lazy(() => import("./pageTypes"));
const PluginsSection = React.lazy(() => import("./plugins"));
const ProductSection = React.lazy(() => import("./products"));
const ProductTypesSection = React.lazy(() => import("./productTypes"));
const StaffSection = React.lazy(() => import("./staff"));
const PermissionGroupSection = React.lazy(() => import("./permissionGroups"));
const SiteSettingsSection = React.lazy(() => import("./siteSettings"));
const TaxesSection = React.lazy(() => import("./taxes"));
const ShippingSection = React.lazy(() => import("./shipping"));

const SuspenseLayout: React.FC = ({ children }) => (
  <React.Suspense
    fallback={
      <Box
        width="100%"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner />
      </Box>
    }
  >
    {children}
  </React.Suspense>
);

if (GTM_ID) {
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

const App: React.FC = () => (
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
                  <BackgroundTasksProvider>
                    <AppStateProvider>
                      <AuthProvider>
                        <ShopProvider>
                          <AppChannelProvider>
                            <ExitFormDialogProvider>
                              <DevModeProvider>
                                <NavigatorSearchProvider>
                                  <ProductAnalytics>
                                    <Routes />
                                  </ProductAnalytics>
                                </NavigatorSearchProvider>
                              </DevModeProvider>
                            </ExitFormDialogProvider>
                          </AppChannelProvider>
                        </ShopProvider>
                      </AuthProvider>
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
        <FeatureFlagsProviderWithUser>
          <ExternalAppProvider>
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
                <SuspenseLayout>
                  <RRRRoutes>
                    <Route
                      path="/"
                      element={
                        <PermissionBasedRoute>
                          <HomePage />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/categories/*"
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                        >
                          <CategorySection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/collections/*"
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                        >
                          <CollectionSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/customers/*"
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_USERS]}
                        >
                          <CustomerSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path={giftCardsSectionUrlName}
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_GIFT_CARD]}
                        >
                          <GiftCardSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/discounts/*"
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_DISCOUNTS]}
                        >
                          <DiscountSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/pages/*"
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_PAGES]}
                        >
                          <PageSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/page-types/*"
                      element={
                        <PermissionBasedRoute
                          permissions={[
                            PermissionEnum.MANAGE_PAGES,
                            PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
                          ]}
                          matchPermission="any"
                        >
                          <PageTypesSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/plugins/*"
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_PLUGINS]}
                        >
                          <PluginsSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/orders/*"
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_ORDERS]}
                        >
                          <OrdersSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/products/*"
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                        >
                          <ProductSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/product-types/*"
                      element={
                        <PermissionBasedRoute
                          permissions={[
                            PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
                          ]}
                        >
                          <ProductTypesSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/staff/*"
                      element={
                        <PermissionBasedRoute>
                          <StaffSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/permission-groups/*"
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_STAFF]}
                        >
                          <PermissionGroupSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/site-settings/*"
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_SETTINGS]}
                        >
                          <SiteSettingsSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route path="/taxes" element={<TaxesSection />} />
                    <Route
                      path="/shipping/*"
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_SHIPPING]}
                        >
                          <ShippingSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/translations/*"
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_TRANSLATIONS]}
                        >
                          <TranslationsSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path={`${navigationSection}/*`}
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_MENUS]}
                        >
                          <NavigationSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path={`${attributeSection}*`}
                      element={
                        <PermissionBasedRoute
                          permissions={[
                            PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
                            PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
                          ]}
                          matchPermission="any"
                        >
                          <AttributeSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path={`${AppSections.appsSection}*`}
                      element={
                        <PermissionBasedRoute>
                          <AppsSectionRoot />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path={`${warehouseSection}*`}
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                        >
                          <WarehouseSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path={`${channelsSection}*`}
                      element={
                        <PermissionBasedRoute
                          permissions={[PermissionEnum.MANAGE_CHANNELS]}
                        >
                          <ChannelsSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path="/configuration/*"
                      element={
                        <PermissionBasedRoute
                          matchPermission="any"
                          permissions={getConfigMenuItemsPermissions(intl)}
                        >
                          <ConfigurationSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route
                      path={`${CustomAppSections.appsSection}*`}
                      element={
                        <PermissionBasedRoute>
                          <CustomAppsSection />
                        </PermissionBasedRoute>
                      }
                    />
                    <Route element={NotFound} />
                  </RRRRoutes>
                </SuspenseLayout>
              </ErrorBoundary>
            </AppLayout>
          </ExternalAppProvider>
        </FeatureFlagsProviderWithUser>
      ) : homePageLoading ? (
        <LoginLoading />
      ) : (
        <Auth />
      )}
    </>
  );
};

render(<App />, document.querySelector("#dashboard-app"));
