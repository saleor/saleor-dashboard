import { formatSubscriptionQuery } from "./formatSubscriptionQuery";

const expected = `subscription {
  event {
    ... on OrderCreated {
      order {
        id
        metafield(key: "crm")
      }
    }
  }
}`;

const plain =
  'subscription { event { ... on OrderCreated { order { id metafield(key: "crm") } } } }';

describe("formatSubscriptionQuery", () => {
  it("formats a plain query", () => {
    // Arrange & Act
    const result = formatSubscriptionQuery(plain);

    // Assert
    expect(result).toBe(expected);
  });

  it("decodes a query stored as a JSON string", () => {
    // Arrange
    const encoded = JSON.stringify(plain);

    // Act
    const result = formatSubscriptionQuery(encoded);

    // Assert
    expect(result).toBe(expected);
  });

  it("decodes a query encoded as a JSON string twice", () => {
    // Arrange
    const encoded = JSON.stringify(JSON.stringify(plain));

    // Act
    const result = formatSubscriptionQuery(encoded);

    // Assert
    expect(result).toBe(expected);
  });

  it("decodes escaped quotes and newlines without surrounding quotes", () => {
    // Arrange
    const escaped = JSON.stringify(plain.replace("{ event", "{\n  event")).slice(1, -1);

    // Act
    const result = formatSubscriptionQuery(escaped);

    // Assert
    expect(escaped).toContain('\\"crm\\"');
    expect(result).toBe(expected);
  });

  it("keeps escapes that belong to a GraphQL string literal", () => {
    // Arrange
    const withLiteral =
      'subscription { event { issuedAt } shop { metafield(key: "{\\"a\\":1}") } }';

    // Act
    const result = formatSubscriptionQuery(withLiteral);

    // Assert
    expect(result).toContain('metafield(key: "{\\"a\\":1}")');
  });

  it("returns the input unchanged when it is not GraphQL", () => {
    // Arrange
    const invalid = "not a query {";

    // Act
    const result = formatSubscriptionQuery(invalid);

    // Assert
    expect(result).toBe(invalid);
  });
});
