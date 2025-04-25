import { getAppMountUri } from "@dashboard/config";
import * as Sentry from "@sentry/react";
import { createBrowserHistory } from "history";
import React from "react";
import { RouterProps as BaseRouterProps } from "react-router";
import { Route as BaseRoute, Router as BaseRouter } from "react-router-dom";

type RouterProps = Omit<BaseRouterProps, "history"> & { children: React.ReactNode };

export const history = createBrowserHistory({
  basename: getAppMountUri(),
});

export const Route = Sentry.withSentryRouting(BaseRoute);

export const Router = (props: RouterProps) => {
  return <BaseRouter history={history}>{props.children}</BaseRouter>;
};
