// @ts-strict-ignore
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import React from "react";

import {
  addressMocks,
  appsMocks,
  introspectionMocks,
  pageTypesMocks,
  warehousesMocks,
} from "./mocks";

const mocks: MockedResponse[] = [
  ...appsMocks,
  ...addressMocks,
  ...warehousesMocks,
  ...pageTypesMocks,
  ...introspectionMocks,
];

export const ApolloMockedProvider = ({ children }) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    {children}
  </MockedProvider>
);
