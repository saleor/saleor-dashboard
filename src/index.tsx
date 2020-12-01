import useAppState from "@saleor/hooks/useAppState";
import { defaultDataIdFromObject, InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { createUploadLink } from "apollo-upload-client";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { render } from "react-dom";
import ErrorBoundary from "react-error-boundary";
import TagManager from "react-gtm-module";
import { useIntl } from "react-intl";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import AppsSection from "./apps";
import { appsSection } from "./apps/urls";
import AttributeSection from "./attributes";
import { attributeSection } from "./attributes/urls";
import Auth from "./auth";
import AuthProvider, { useAuth } from "./auth/AuthProvider";
import LoginLoading from "./auth/components/LoginLoading/LoginLoading";
import SectionRoute from "./auth/components/SectionRoute";
import authLink from "./auth/link";
import { hasPermission } from "./auth/misc";
import CategorySection from "./categories";
import ChannelsSection from "./channels";
import { channelsSection } from "./channels/urls";
import CollectionSection from "./collections";
import AppLayout from "./components/AppLayout";
import useAppChannel, {
  AppChannelProvider
} from "./components/AppLayout/AppChannelContext";
import { DateProvider } from "./components/Date";
import { LocaleProvider } from "./components/Locale";
import MessageManagerProvider from "./components/messages";
import { ShopProvider } from "./components/Shop";
import ThemeProvider from "./components/Theme";
import { WindowTitle } from "./components/WindowTitle";
import { API_URI, APP_MOUNT_URI, GTM_ID } from "./config";
import ConfigurationSection, { createConfigurationMenu } from "./configuration";
import AppStateProvider from "./containers/AppState";
import BackgroundTasksProvider from "./containers/BackgroundTasks";
import { CustomerSection } from "./customers";
import DiscountSection from "./discounts";
import HomePage from "./home";
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
import ShippingSection from "./shipping";
import SiteSettingsSection from "./siteSettings";
import StaffSection from "./staff";
import TaxesSection from "./taxes";
import TranslationsSection from "./translations";
import { PermissionEnum } from "./types/globalTypes";
import WarehouseSection from "./warehouses";
import { warehouseSection } from "./warehouses/urls";

if (process.env.GTM_ID) {
  TagManager.initialize({ gtmId: GTM_ID });
}

// DON'T TOUCH THIS
// These are separate clients and do not share configs between themselves
// so we need to explicitly set them
const linkOptions = {
  credentials: "include",
  uri: API_URI
};
const uploadLink = createUploadLink(linkOptions);
const batchLink = new BatchHttpLink({
  batchInterval: 100,
  ...linkOptions
});

const link = ApolloLink.split(
  operation => operation.getContext().useBatching,
  batchLink,
  uploadLink
);

const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject: (obj: any) => {
      // We need to set manually shop's ID, since it is singleton and
      // API does not return its ID
      if (obj.__typename === "Shop") {
        return "shop";
      }
      return defaultDataIdFromObject(obj);
    }
  }),
  link: authLink.concat(link)
});

const App: React.FC = () => {
  const isDark = localStorage.getItem("theme") === "true";

  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter basename={APP_MOUNT_URI}>
        <ThemeProvider isDefaultDark={isDark}>
          <DateProvider>
            <LocaleProvider>
              <MessageManagerProvider>
                <BackgroundTasksProvider>
                  <AppStateProvider>
                    <ShopProvider>
                      <AuthProvider>
                        <AppChannelProvider>
                          <Routes />
                        </AppChannelProvider>
                      </AuthProvider>
                    </ShopProvider>
                  </AppStateProvider>
                </BackgroundTasksProvider>
              </MessageManagerProvider>
            </LocaleProvider>
          </DateProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
};

const Routes: React.FC = () => {
  const intl = useIntl();
  const [, dispatchAppState] = useAppState();
  const {
    hasToken,
    isAuthenticated,
    tokenAuthLoading,
    tokenVerifyLoading,
    user
  } = useAuth();
  const { channel } = useAppChannel(false);

  return (
    <>
      <WindowTitle title={intl.formatMessage(commonMessages.dashboard)} />
      {channel &&
      isAuthenticated &&
      !tokenAuthLoading &&
      !tokenVerifyLoading ? (
        <AppLayout>
          <ErrorBoundary
            onError={() =>
              dispatchAppState({
                payload: {
                  error: "unhandled"
                },
                type: "displayError"
              })
            }
          >
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
                permissions={[PermissionEnum.MANAGE_PAGES]}
                path="/page-types"
                component={PageTypesSection}
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
                  PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES
                ]}
                path="/product-types"
                component={ProductTypesSection}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_STAFF]}
                path="/staff"
                component={StaffSection}
              />
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
                path="/taxes"
                component={TaxesSection}
              />
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
                  PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES
                ]}
                path={attributeSection}
                component={AttributeSection}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_APPS]}
                path={appsSection}
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
              {createConfigurationMenu(intl).filter(menu =>
                menu.menuItems.map(item => hasPermission(item.permission, user))
              ).length > 0 && (
                <SectionRoute
                  exact
                  path="/configuration"
                  component={ConfigurationSection}
                />
              )}
              <Route component={NotFound} />
            </Switch>
          </ErrorBoundary>
        </AppLayout>
      ) : (isAuthenticated && !channel) || (hasToken && tokenVerifyLoading) ? (
        <LoginLoading />
      ) : (
        <Auth />
      )}
    </>
  );
};

render(<App />, document.querySelector("#dashboard-app"));
