import {
  aliasMutation,
  hasOperationName,
} from "../../api/utils/graphqlMockUtils";

Cypress.Commands.add("mockMutation", (method, mutationName, fixtureUrl) =>
  cy
    .intercept(method, "/graphql/", req => {
      aliasMutation(req, mutationName);

      if (hasOperationName(req, mutationName)) {
        req.reply({
          fixture: `../fixtures/mockedData/${fixtureUrl}`,
        });
      }
    })
    .as(`mocked${mutationName}`),
);
