import { MockedResponse } from "@apollo/react-testing";

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
