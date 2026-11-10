import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";

import { getServerErrorProblem } from "./serverErrors";

const withStatus = (name: string, statusCode: number): Error =>
  Object.assign(new Error(`${name} ${statusCode}`), { name, statusCode });

describe("getServerErrorProblem", () => {
  it.each([
    ["a 500", withStatus("ServerError", 500), { kind: "serverError", status: 500 }],
    [
      "Saleor's HTML crash page",
      withStatus("ServerParseError", 500),
      { kind: "serverError", status: 500 },
    ],
    [
      "a proxy's HTML 413 page",
      withStatus("ServerParseError", 413),
      { kind: "refused", status: 413 },
    ],
    [
      "a 4xx with no message from Saleor",
      withStatus("ServerError", 400),
      { kind: "refused", status: 400 },
    ],
    ["a rate limit", withStatus("ServerError", 429), { kind: "refused", status: 429 }],
    ["a captive portal's 200 page", withStatus("ServerParseError", 200), { kind: "unreadable" }],
  ])("recognises %s", (_case, networkError, expected) => {
    // Arrange & Act
    const problem = getServerErrorProblem(new ApolloError({ networkError }));

    // Assert
    expect(problem).toEqual(expected);
  });

  it.each([
    ["a proxy's 503, which the connection banner explains", withStatus("ServerError", 503)],
    ["a proxy's HTML 502 page, which the banner explains", withStatus("ServerParseError", 502)],
    ["a request with no answer", new TypeError("Failed to fetch")],
    [
      "a 500 carrying Saleor's own message",
      Object.assign(withStatus("ServerError", 500), {
        result: { errors: [{ message: "Plugin failed to process the payment." }] },
      }),
    ],
    [
      "a 400 carrying Saleor's own message",
      Object.assign(withStatus("ServerError", 400), {
        result: { errors: [{ message: 'Variable "$id" was not provided.' }] },
      }),
    ],
  ])("leaves out %s", (_case, networkError) => {
    // Arrange & Act
    const problem = getServerErrorProblem(new ApolloError({ networkError }));

    // Assert
    expect(problem).toBeNull();
  });

  it("leaves out an error Saleor sent as a GraphQL message", () => {
    // Arrange
    const error = new ApolloError({ graphQLErrors: [new GraphQLError("Product not found")] });

    // Act
    const problem = getServerErrorProblem(error);

    // Assert
    expect(problem).toBeNull();
  });
});
