import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import React from "react";

import {
  addressMocks,
  appsMocks,
  pageTypesMocks,
  warehousesMocks,
} from "./mocks";

const mocks: MockedResponse[] = [
  ...appsMocks,
  ...addressMocks,
  ...warehousesMocks,
  ...pageTypesMocks,
];

export const ApolloMockedProvider = ({ children }) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    {children}
  </MockedProvider>
);
