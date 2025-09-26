import { modelingSection } from "@dashboard/modeling/urls";
import { modelTypesPath } from "@dashboard/modelTypes/urls";
import { structuresListPath } from "@dashboard/structures/urls";
import { Redirect, Route } from "react-router-dom";
import urlJoin from "url-join";

export const legacyRedirects = [
  // Redirect old /pages/* to /models/*
  <Route
    key="pages-redirect"
    path="/pages/:rest(.*)"
    render={({ match, location }) => (
      <Redirect
        to={{
          pathname: urlJoin(modelingSection, match.params.rest || ""),
          search: location.search,
        }}
      />
    )}
  />,
  // Redirect old /page-types/* to /model-types/*
  <Route
    key="page-types-redirect"
    path="/page-types/:rest(.*)"
    render={({ match, location }) => (
      <Redirect
        to={{
          pathname: urlJoin(modelTypesPath, match.params.rest || ""),
          search: location.search,
        }}
      />
    )}
  />,
  // Redirect old /navigation/* to /structures/*
  <Route
    key="navigation-redirect"
    path="/navigation/:rest(.*)"
    render={({ match, location }) => (
      <Redirect
        to={{
          pathname: urlJoin(structuresListPath, match.params.rest || ""),
          search: location.search,
        }}
      />
    )}
  />,
];
