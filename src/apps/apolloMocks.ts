import { MockedResponse } from "@apollo/client/testing";

import { extensionList } from "./queries";

export const mocks: MockedResponse[] = [
  {
    request: {
      query: extensionList,
    },
    result: {
      data: [],
    },
  },
];
