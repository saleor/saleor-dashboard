import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import React from "react";

import { addressMocks, appsMocks } from "./mocks";

const mocks: MockedResponse[] = [...appsMocks, ...addressMocks];

export const ApolloMockedProvider = ({ children }) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    {children}
  </MockedProvider>
);
