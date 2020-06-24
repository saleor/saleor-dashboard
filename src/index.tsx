import { API_URI, APP_MOUNT_URI, GTM_ID } from "./config";
import Auth, { getAuthToken, removeAuthToken } from "./auth";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ConfigurationSection, { createConfigurationMenu } from "./configuration";
import { ErrorResponse, onError } from "apollo-link-error";
import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";
import { MessageManager, notificationOptions } from "./components/messages";

import { Provider as AlertProvider } from "react-alert";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { ApolloProvider } from "react-apollo";
import AppLayout from "./components/AppLayout";
import AppStateProvider from "./containers/AppState";
import AttributeSection from "./attributes";
import AuthProvider from "./auth/AuthProvider";
import BackgroundTasksProvider from "./containers/BackgroundTasks";
import { BatchHttpLink } from "apollo-link-batch-http";
import CategorySection from "./categories";
import CollectionSection from "./collections";
import { CustomerSection } from "./customers";
import { DateProvider } from "./components/Date";
import DiscountSection from "./discounts";
import ErrorBoundary from "react-error-boundary";
import HomePage from "./home";
import { LocaleProvider } from "./components/Locale";
import LoginLoading from "./auth/components/LoginLoading/LoginLoading";
import NavigationSection from "./navigation";
import Navigator from "@saleor/components/Navigator";
import { NotFound } from "./NotFound";
import OrdersSection from "./orders";
import PageSection from "./pages";
import { PermissionEnum } from "./types/globalTypes";
import PermissionGroupSection from "./permissionGroups";
import PluginsSection from "./plugins";
import ProductSection from "./products";
import ProductTypesSection from "./productTypes";
import React from "react";
import SectionRoute from "./auth/components/SectionRoute";
import ServiceSection from "./services";
import ShippingSection from "./shipping";
import { ShopProvider } from "./components/Shop";
import SiteSettingsSection from "./siteSettings";
import StaffSection from "./staff";
import TagManager from "react-gtm-module";
import TaxesSection from "./taxes";
import ThemeProvider from "./components/Theme";
import TranslationsSection from "./translations";
import WarehouseSection from "./warehouses";
import WebhooksSection from "./webhooks";
import { WindowTitle } from "./components/WindowTitle";
import { attributeSection } from "./attributes/urls";
import { commonMessages } from "./intl";
import { createUploadLink } from "apollo-upload-client";
import { hasPermission } from "./auth/misc";
import { isJwtError } from "./auth/errors";
import { navigationSection } from "./navigation/urls";
import { render } from "react-dom";
import { serviceSection } from "./services/urls";
import { setContext } from "apollo-link-context";
import useAppState from "@saleor/hooks/useAppState";
import { useIntl } from "react-intl";
import { warehouseSection } from "./warehouses/urls";

interface ResponseError extends ErrorResponse {
  networkError?: Error & {
    statusCode?: number;
    bodyText?: string;
  };
}

if (process.env.GTM_ID !== undefined) {
  TagManager.initialize({ gtmId: GTM_ID });
}

const invalidTokenLink = onError((error: ResponseError) => {
  if (
    (error.networkError && error.networkError.statusCode === 401) ||
    error.graphQLErrors?.some(isJwtError)
  ) {
    removeAuthToken();
  }
});

const authLink = setContext((_, context) => {
  const authToken = getAuthToken();

  return {
    ...context,
    headers: {
      ...context.headers,
      Authorization: authToken ? `JWT ${authToken}` : null
    }
  };
});

// DON'T TOUCH THIS
// These are separate clients and do not share configs between themselves
// so we need to explicitly set them
const linkOptions = {
  credentials: "same-origin",
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
  link: invalidTokenLink.concat(authLink.concat(link))
});

const App: React.FC = () => {
  const isDark = localStorage.getItem("theme") === "true";

  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter basename={APP_MOUNT_URI}>
        <ThemeProvider isDefaultDark={isDark}>
          <DateProvider>
            <LocaleProvider>
              <AlertProvider {...notificationOptions} template={MessageManager}>
                <BackgroundTasksProvider>
                  <AppStateProvider>
                    <ShopProvider>
                      <Routes />
                    </ShopProvider>
                  </AppStateProvider>
                </BackgroundTasksProvider>
              </AlertProvider>
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

  return (
    <>
      <WindowTitle title={intl.formatMessage(commonMessages.dashboard)} />
      <AuthProvider>
        {({
          hasToken,
          isAuthenticated,
          tokenAuthLoading,
          tokenVerifyLoading,
          user
        }) =>
          isAuthenticated && !tokenAuthLoading && !tokenVerifyLoading ? (
            <AppLayout>
              <Navigator />
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
                    permissions={[PermissionEnum.MANAGE_PRODUCTS]}
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
                    permissions={[PermissionEnum.MANAGE_WEBHOOKS]}
                    path="/webhooks"
                    component={WebhooksSection}
                  />
                  <SectionRoute
                    permissions={[PermissionEnum.MANAGE_MENUS]}
                    path={navigationSection}
                    component={NavigationSection}
                  />
                  <SectionRoute
                    permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                    path={attributeSection}
                    component={AttributeSection}
                  />
                  <SectionRoute
                    permissions={[PermissionEnum.MANAGE_APPS]}
                    path={serviceSection}
                    component={ServiceSection}
                  />
                  <SectionRoute
                    permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                    path={warehouseSection}
                    component={WarehouseSection}
                  />
                  {createConfigurationMenu(intl).filter(menu =>
                    menu.menuItems.map(item =>
                      hasPermission(item.permission, user)
                    )
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
          ) : hasToken && tokenVerifyLoading ? (
            <LoginLoading />
          ) : (
            <Auth hasToken={hasToken} />
          )
        }
      </AuthProvider>
    </>
  );
};

render(<App />, document.querySelector("#dashboard-app"));
