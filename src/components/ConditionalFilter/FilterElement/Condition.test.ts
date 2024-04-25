import { InitialStateResponse } from "../API/InitialStateResponse";
import { STATIC_CONDITIONS } from "../constants";
import { UrlToken } from "../ValueProvider/UrlToken";
import { Condition } from "./Condition";

describe("ConditionalFilter / FilterElement / Condition", () => {
  it("creates empty condition", () => {
    // Arrange
    const condition = Condition.createEmpty();

    // Act & Assert
    expect(condition.isEmpty()).toBeTruthy();
    expect(condition.options).toEqual([]);
  });
  it("creates empty for given slug", () => {
    // Arrange
    const condition = Condition.emptyFromSlug("category");

    // Act & Assert
    expect(condition.isEmpty()).toBeTruthy();
    expect(condition.options).toEqual(STATIC_CONDITIONS.category);
  });
  // Arrange
  it.each([
    {
      token: new UrlToken("category", ["cat1"], "s", "is"),
      response: new InitialStateResponse([
        {
          label: "Cat1",
          value: "cat-1-id",
          slug: "cat1",
        },
      ]),
      expected: {
        options: [
          { type: "combobox", label: "is", value: "input-1" },
          { type: "multiselect", label: "in", value: "input-2" },
        ],
        selected: {
          value: { label: "Cat1", value: "cat-1-id", slug: "cat1" },
          conditionValue: { type: "combobox", label: "is", value: "input-1" },
          options: [],
          loading: false,
        },
        loading: false,
      },
    },
    {
      token: new UrlToken("some-attr1", ["some-attr-1z"], "m", "in"),
      response: new InitialStateResponse([], {
        "some-attr1": {
          choices: [
            {
              label: "Some attr 1z",
              value: "some-attr-1z",
              slug: "some-attr-1z",
              originalSlug: "some-attr-1z",
            },
          ],
          inputType: "MULTISELECT",
          label: "Some attr 1",
          slug: "some-attr1",
          value: "some-attr1",
        },
      }),
      expected: {
        options: [
          {
            label: "in",
            type: "multiselect",
            value: "input-2",
          },
        ],
        selected: {
          conditionValue: {
            label: "in",
            type: "multiselect",
            value: "input-2",
          },
          value: [
            {
              label: "Some attr 1z",
              originalSlug: "some-attr-1z",
              slug: "some-attr-1z",
              value: "some-attr-1z",
            },
          ],
          options: [],
          loading: false,
        },
        loading: false,
      },
    },
  ])("creates instance from url token", ({ token, response, expected }) => {
    // Act
    const condition = Condition.fromUrlToken(token, response);

    // Assert
    expect(condition).toEqual(expected);
  });
});
