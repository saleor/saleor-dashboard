import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { Decorator } from "@storybook/react-vite";
import { DocumentNode, print } from "graphql";

export type MockResponse = {
  query: DocumentNode;
  data: object;
};

export const withApolloMocks = (responses: MockResponse[] | Promise<MockResponse[]>): Decorator => {
  const resolved = Promise.resolve(responses);

  const mockLink = new ApolloLink(
    operation =>
      new Observable(observer => {
        resolved.then(items => {
          const queryStr = print(operation.query);
          const match = items.find(r => print(r.query) === queryStr);

          observer.next({ data: match?.data ?? null });
          observer.complete();
        });
      }),
  );

  const client = new ApolloClient({
    link: mockLink,
    cache: new InMemoryCache({ addTypename: false }),
    defaultOptions: {
      query: { fetchPolicy: "no-cache" },
      watchQuery: { fetchPolicy: "no-cache" },
    },
  });

  const decorator: Decorator = (Story: React.ComponentType) => (
    <ApolloProvider client={client}>
      <Story />
    </ApolloProvider>
  );

  return decorator;
};
