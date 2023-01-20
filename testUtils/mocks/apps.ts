import { MockedResponse } from "@apollo/client/testing";
import { extensionList } from "@dashboard/apps/queries";

export const appsMocks: MockedResponse[] = [
  {
    request: {
      query: extensionList,
    },
    result: {
      data: [],
    },
  },
];
