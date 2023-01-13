import {
  aliasMutation,
  hasOperationName,
} from "../../api/utils/graphqlMockUtils";

Cypress.Commands.add("mockMutation", (method, mutationName, alias) =>
  cy.intercept(method, "/graphql/", req => {
    aliasMutation(req, mutationName);

    if (hasOperationName(req, mutationName)) {
      req.alias = alias;

      req.reply({
        fixture: "../fixtures/mockedData/app/AppsList.json",
      });
    }
  }),
);
