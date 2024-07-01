import { useIntl } from "react-intl";

import getCommandModeActions from "./actions";

jest.mock("react-intl", () => {
  return {
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(x => x.defaultMessage),
    })),
    defineMessages: jest.fn(message => message),
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
