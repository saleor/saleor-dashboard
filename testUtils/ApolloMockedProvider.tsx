import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import type React from "react";

import { addressMocks } from "./mocks/address";
import { appsMocks } from "./mocks/apps";
import { introspectionMocks } from "./mocks/introspection";
import { pageTypesMocks } from "./mocks/pageTypes";
import { warehousesMocks } from "./mocks/warehouses";

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
