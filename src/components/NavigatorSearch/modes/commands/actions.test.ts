import { useIntl } from "react-intl";

import getCommandModeActions from "./actions";

jest.mock("react-intl", () => {
  const reactIntl = jest.requireActual("react-intl");
  const intl = reactIntl.createIntl({
    locale: "en",
  });

  return {
    ...reactIntl,
    useIntl: () => intl,
  };
});

describe("actions search (scoring)", () => {
  it("returns options when no query is given", () => {
    // Arrange & Act
    const intl = useIntl();
    const actions = getCommandModeActions("", intl, jest.fn(), jest.fn(), jest.fn());

    // Assert
    expect(actions.length).toBe(5);
  });

  it("searches, returns only related results", () => {
    // Arrange & Act
    const intl = useIntl();
    const actions = getCommandModeActions("Category", intl, jest.fn(), jest.fn(), jest.fn());

    // Assert
    expect(actions.length).toBe(1);
    expect(actions[0].label).toBe("Create Category");
  });
});
