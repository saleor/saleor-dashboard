import {
  AppStateContext,
  AppStateContextType,
} from "@dashboard/containers/AppState";
import { initialAppState } from "@dashboard/containers/AppState/state";
import React from "react";

import ErrorPage, { ErrorPageProps } from "./ErrorPage";

const initialAppStateFixture: AppStateContextType = [
  initialAppState,
  () => undefined,
];
const errorAppStateFixture: AppStateContextType = [
  {
    error: {
      id: "LS5E4RahA4Dc+mNICEUKXPaVkOR1ChT=",
      type: "unhandled",
    },
    loading: false,
  },
  () => undefined,
];

const props: Omit<ErrorPageProps, "classes"> = {
  onBack: () => undefined,
  onRefresh: () => undefined,
};

export default {
  title: "Error / Error page",
};

export const Default = () => (
  <AppStateContext.Provider value={initialAppStateFixture}>
    <ErrorPage {...props} />
  </AppStateContext.Provider>
);

export const WithErrorId = () => (
  <AppStateContext.Provider value={errorAppStateFixture}>
    <ErrorPage {...props} />
  </AppStateContext.Provider>
);
