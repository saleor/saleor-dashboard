import "@saleor/macaw-ui-next/style";
import "./index.css";

import { ApolloProvider } from "@apollo/client";
import DemoBanner from "@dashboard/components/DemoBanner";
import { history, Route, Router } from "@dashboard/components/Router";
import { PermissionEnum } from "@dashboard/graphql";
import useAppState from "@dashboard/hooks/useAppState";
import { ThemeProvider } from "@dashboard/theme";
import { OnboardingProvider } from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { SaleorProvider } from "@saleor/sdk";
import React from "react";
import { render } from "react-dom";
import { ErrorBoundary } from "react-error-boundary";
import TagManager from "react-gtm-module";
import { useIntl } from "react-intl";
import { Switch } from "react-router-dom";

import { AppsSectionRoot } from "./apps";
import { ExternalAppProvider } from "./apps/components/ExternalAppContext";
import { AppSections } from "./apps/urls";
import AttributeSection from "./attributes";
import { attributeSection } from "./attributes/urls";
import Auth from "./auth";
import AuthProvider from "./auth/AuthProvider";
import LoginLoading from "./auth/components/LoginLoading/LoginLoading";
import SectionRoute from "./auth/components/SectionRoute";
import { useAuthRedirection } from "./auth/hooks/useAuthRedirection";
import CategorySection from "./categories";
import ChannelsSection from "./channels";
import { channelsSection } from "./channels/urls";
import CollectionSection from "./collections";
import AppLayout from "./components/AppLayout";
import useAppChannel, { AppChannelProvider } from "./components/AppLayout/AppChannelContext";
import { DateProvider } from "./components/Date";
import { DevModeProvider } from "./components/DevModePanel/DevModeProvider";
import ErrorPage from "./components/ErrorPage";
import ExitFormDialogProvider from "./components/Form/ExitFormDialogProvider";
import { LocaleProvider } from "./components/Locale";
import MessageManagerProvider from "./components/messages";
import { NavigatorSearchProvider } from "./components/NavigatorSearch/NavigatorSearchProvider";
import { ProductAnalytics } from "./components/ProductAnalytics";
import { SavebarRefProvider } from "./components/Savebar/SavebarRefContext";
import { ShopProvider } from "./components/Shop";
import { WindowTitle } from "./components/WindowTitle";
import { DEMO_MODE, GTM_ID } from "./config";
import ConfigurationSection from "./configuration";
import { getConfigMenuItemsPermissions } from "./configuration/utils";
import AppStateProvider from "./containers/AppState";
import BackgroundTasksProvider from "./containers/BackgroundTasks";
import CustomAppsSection from "./custom-apps";
import { CustomAppSections } from "./custom-apps/urls";
import { CustomerSection } from "./customers";
import DiscountSection from "./discounts";
import { FeatureFlagsProviderWithUser } from "./featureFlags/FeatureFlagsProvider";
import GiftCardSection from "./giftCards";
import { giftCardsSectionUrlName } from "./giftCards/urls";
import { apolloClient, saleorClient } from "./graphql/client";
import { useLocationState } from "./hooks/useLocationState";
import { commonMessages } from "./intl";
import NavigationSection from "./navigation";
import { navigationSection } from "./navigation/urls";
import { NotFound } from "./NotFound";
import OrdersSection from "./orders";
import PageSection from "./pages";
import PageTypesSection from "./pageTypes";
import PermissionGroupSection from "./permissionGroups";
import PluginsSection from "./plugins";
import ProductSection from "./products";
import ProductTypesSection from "./productTypes";
import errorTracker from "./services/errorTracking";
import ShippingSection from "./shipping";
import SiteSettingsSection from "./siteSettings";
import StaffSection from "./staff";
import TaxesSection from "./taxes";
import { paletteOverrides, themeOverrides } from "./themeOverrides";
import TranslationsSection from "./translations";
import WarehouseSection from "./warehouses";
import { warehouseSection } from "./warehouses/urls";
import { WelcomePage } from "./welcomePage";

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

const App: React.FC = () => (
  <SaleorProvider client={saleorClient}>
    <ApolloProvider client={apolloClient}>
      <Router>
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
                <ErrorPage onBack={resetErrorBoundary} onRefresh={() => window.location.reload()} />
              )}
            >
              <Switch>
                <SectionRoute exact path="/" component={WelcomePage} />
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
                  permissions={[]}
                  path={AppSections.appsSection}
                  component={AppsSectionRoot}
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
                <SectionRoute path={CustomAppSections.appsSection} component={CustomAppsSection} />
                <Route component={NotFound} />
              </Switch>
            </ErrorBoundary>
          </AppLayout>
        </ExternalAppProvider>
      ) : homePageLoading ? (
        <LoginLoading />
      ) : (
        <Auth />
      )}
    </>
  );
};

render(<App />, document.querySelector("#dashboard-app"));
