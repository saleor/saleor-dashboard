import { MockedProvider, MockedResponse } from "@apollo/client/testing";
// mocks
import { mocks as appMocks } from "@saleor/apps/apolloMocks";
import React from "react";

const mocks: MockedResponse[] = [...appMocks];

export const ApolloMockedProvider = ({ children }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);
