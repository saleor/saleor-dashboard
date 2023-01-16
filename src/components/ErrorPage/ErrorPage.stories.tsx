import {
  AppStateContext,
  AppStateContextType,
} from "@dashboard/containers/AppState";
import { initialAppState } from "@dashboard/containers/AppState/state";
import Decorator from "@dashboard/storybook/Decorator";
import { storiesOf } from "@storybook/react";
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

storiesOf("Error / Error page", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <AppStateContext.Provider value={initialAppStateFixture}>
      <ErrorPage {...props} />
    </AppStateContext.Provider>
  ))
  .add("with error id", () => (
    <AppStateContext.Provider value={errorAppStateFixture}>
      <ErrorPage {...props} />
    </AppStateContext.Provider>
  ));
