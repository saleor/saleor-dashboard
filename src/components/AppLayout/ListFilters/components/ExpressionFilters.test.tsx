import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ExpressionFilterPanel, ExpressionFilters } from "./ExpressionFilters";

jest.mock("@dashboard/components/ConditionalFilter", () => {
  const actual = jest.requireActual("@dashboard/components/ConditionalFilter");

  return {
    ...actual,
    useConditionalFilterContext: jest.fn(),
    ConditionalFilters: ({ layout }: { layout: string }): JSX.Element => (
      <div data-test-id="conditional-filters">{layout}</div>
    ),
  };
});

const mockUseConditionalFilterContext = useConditionalFilterContext as jest.Mock;

const setContext = ({
  isOpen = false,
  count = 0,
  containerValue = [],
}: {
  isOpen?: boolean;
  count?: number;
  containerValue?: unknown[];
}): {
  setOpen: jest.Mock;
  clearEmpty: jest.Mock;
  createEmpty: jest.Mock;
  resetToProvider: jest.Mock;
} => {
  const setOpen = jest.fn();
  const clearEmpty = jest.fn();
  const createEmpty = jest.fn();
  const resetToProvider = jest.fn();

  mockUseConditionalFilterContext.mockReturnValue({
    valueProvider: {
      value: [],
      count,
      loading: false,
      persist: jest.fn(),
      clear: jest.fn(),
      isPersisted: jest.fn(),
      getTokenByName: jest.fn(),
    },
    containerState: { value: containerValue, clearEmpty, createEmpty, resetToProvider },
    filterWindow: { isOpen, setOpen },
    leftOperandsProvider: { operands: [], setOperands: jest.fn() },
    apiProvider: {},
    queryApiType: "WHERE",
  });

  return { setOpen, clearEmpty, createEmpty, resetToProvider };
};

describe("ExpressionFilters", () => {
  it("opens the foldable panel from the Filters button", async () => {
    // Arrange
    const user = userEvent.setup();
    const { setOpen, createEmpty, resetToProvider } = setContext({ isOpen: false });

    render(
      <Wrapper>
        <ExpressionFilters />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("filters-button"));

    // Assert
    expect(resetToProvider).toHaveBeenCalledWith({ seedEmpty: true });
    expect(createEmpty).not.toHaveBeenCalled();
    expect(setOpen).toHaveBeenCalledWith(true);
    expect(screen.getByTestId("filters-button")).toHaveAttribute("aria-expanded", "false");
  });

  it("does not seed an empty row when applied filters are already in the container", async () => {
    // Arrange
    const user = userEvent.setup();
    const { setOpen, createEmpty, resetToProvider } = setContext({
      isOpen: false,
      count: 1,
      containerValue: [{ id: "channel" }],
    });

    render(
      <Wrapper>
        <ExpressionFilters />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("filters-button"));

    // Assert
    expect(resetToProvider).toHaveBeenCalledWith({ seedEmpty: true });
    expect(createEmpty).not.toHaveBeenCalled();
    expect(setOpen).toHaveBeenCalledWith(true);
  });

  it("renders the panel with the card layout when open", () => {
    // Arrange
    setContext({ isOpen: true, count: 1 });

    render(
      <Wrapper>
        <ExpressionFilterPanel />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("filters-panel")).toBeInTheDocument();
    expect(screen.getByTestId("conditional-filters")).toHaveTextContent("panel");
  });

  it("does not render the panel when the bar is folded", () => {
    // Arrange
    setContext({ isOpen: false });

    render(
      <Wrapper>
        <ExpressionFilterPanel />
      </Wrapper>,
    );

    // Assert
    expect(screen.queryByTestId("filters-panel")).not.toBeInTheDocument();
  });

  it("shows the applied filter count in a pill", () => {
    // Arrange
    setContext({ count: 3 });

    // Act
    render(
      <Wrapper>
        <ExpressionFilters />
      </Wrapper>,
    );

    // Assert
    const button = screen.getByTestId("filters-button");

    expect(button).toHaveTextContent("Filters");
    expect(button).toHaveTextContent("3");
    expect(button).not.toHaveTextContent("(3)");
  });

  it("hides the count pill when no filters are applied", () => {
    // Arrange
    setContext({ count: 0 });

    // Act
    render(
      <Wrapper>
        <ExpressionFilters />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("filters-button")).toHaveTextContent("Filters");
    expect(screen.getByTestId("filters-button")).not.toHaveTextContent("0");
  });

  it("folds the panel and discards drafts without clearing applied filters", async () => {
    // Arrange
    const user = userEvent.setup();
    const { setOpen, clearEmpty, resetToProvider } = setContext({ isOpen: true });

    render(
      <Wrapper>
        <ExpressionFilters />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("filters-button"));

    // Assert
    expect(resetToProvider).toHaveBeenCalledWith();
    expect(clearEmpty).not.toHaveBeenCalled();
    expect(setOpen).toHaveBeenCalledWith(false);
  });
});
