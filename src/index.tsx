import { defaultDataIdFromObject, InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { setContext } from "apollo-link-context";
import { ErrorResponse, onError } from "apollo-link-error";
import { createUploadLink } from "apollo-upload-client";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { render } from "react-dom";
import ErrorBoundary from "react-error-boundary";
import { useIntl } from "react-intl";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Navigator from "@saleor/components/Navigator";
import useAppState from "@saleor/hooks/useAppState";
import AttributeSection from "./attributes";
import { attributeSection } from "./attributes/urls";
import Auth, { getAuthToken, removeAuthToken } from "./auth";
import { isJwtError } from "./auth/errors";
import AuthProvider from "./auth/AuthProvider";
import LoginLoading from "./auth/components/LoginLoading/LoginLoading";
import SectionRoute from "./auth/components/SectionRoute";
import { hasPermission } from "./auth/misc";
import CategorySection from "./categories";
import CollectionSection from "./collections";
import AppLayout from "./components/AppLayout";
import { DateProvider } from "./components/Date";
import { LocaleProvider } from "./components/Locale";
import { MessageManager } from "./components/messages";
import { ShopProvider } from "./components/Shop";
import ThemeProvider from "./components/Theme";
import { WindowTitle } from "./components/WindowTitle";
import { API_URI, APP_MOUNT_URI } from "./config";
import ConfigurationSection, { createConfigurationMenu } from "./configuration";
import AppStateProvider from "./containers/AppState";
import { CustomerSection } from "./customers";
import DiscountSection from "./discounts";
import HomePage from "./home";
import { commonMessages } from "./intl";
import NavigationSection from "./navigation";
import { navigationSection } from "./navigation/urls";
import { NotFound } from "./NotFound";
import OrdersSection from "./orders";
import PageSection from "./pages";
import PluginsSection from "./plugins";
import ProductSection from "./products";
import ProductTypesSection from "./productTypes";
import PermissionGroupSection from "./permissionGroups";
import ServiceSection from "./services";
import { serviceSection } from "./services/urls";
import ShippingSection from "./shipping";
import SiteSettingsSection from "./siteSettings";
import StaffSection from "./staff";
import TaxesSection from "./taxes";
import TranslationsSection from "./translations";
import { PermissionEnum } from "./types/globalTypes";
import WebhooksSection from "./webhooks";
import { warehouseSection } from "./warehouses/urls";
import WarehouseSection from "./warehouses";

interface ResponseError extends ErrorResponse {
  networkError?: Error & {
    statusCode?: number;
    bodyText?: string;
  };
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
              <MessageManager>
                <AppStateProvider>
                  <ShopProvider>
                    <Routes />
                  </ShopProvider>
                </AppStateProvider>
              </MessageManager>
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
