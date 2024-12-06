import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import * as React from "react";

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

interface ApolloMockedProviderProps {
  children: React.ReactNode;
}

export const ApolloMockedProvider = ({ children }: ApolloMockedProviderProps) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    {children}
  </MockedProvider>
);
