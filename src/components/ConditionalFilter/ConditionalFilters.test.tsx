import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps } from "react";

import { ConditionalFilters } from "./ConditionalFilters";
import { useConditionalFilterContext } from "./context";
import { type FiltersArea } from "./FiltersArea";

jest.mock("./context", () => ({
  useConditionalFilterContext: jest.fn(),
}));

jest.mock("./FiltersArea", () => ({
  FiltersArea: ({ layout, onClear, onCancel }: ComponentProps<typeof FiltersArea>): JSX.Element => (
    <div>
      <span data-test-id="filters-layout">{layout}</span>
      <button type="button" data-test-id="reset-all-filters-button" onClick={onClear}>
        Clear filters
      </button>
      {layout === "panel" ? (
        <button type="button" data-test-id="close-filters-button" onClick={onCancel}>
          Close
        </button>
      ) : null}
    </div>
  ),
}));

jest.mock("./LoadingFiltersArea", () => ({
  LoadingFiltersArea: (): null => null,
}));

const mockUseConditionalFilterContext = useConditionalFilterContext as jest.Mock;

const setContext = (): {
  clear: jest.Mock;
  resetToProvider: jest.Mock;
  clearEmpty: jest.Mock;
} => {
  const clear = jest.fn();
  const resetToProvider = jest.fn();
  const clearEmpty = jest.fn();

  mockUseConditionalFilterContext.mockReturnValue({
    valueProvider: { loading: false, persist: jest.fn(), clear, value: [] },
    containerState: { resetToProvider, clearEmpty },
  });

  return { clear, resetToProvider, clearEmpty };
};

describe("ConditionalFilters", () => {
  it("clears applied filters from the shared Clear filters button", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = jest.fn();
    const { clear, resetToProvider, clearEmpty } = setContext();

    render(<ConditionalFilters layout="panel" onClose={onClose} />);

    // Act
    await user.click(screen.getByTestId("reset-all-filters-button"));

    // Assert
    expect(clear).toHaveBeenCalled();
    expect(resetToProvider).toHaveBeenCalled();
    expect(clearEmpty).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("dismisses the panel without clearing applied filters", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = jest.fn();
    const { clear, resetToProvider, clearEmpty } = setContext();

    render(<ConditionalFilters layout="panel" onClose={onClose} />);

    // Act
    await user.click(screen.getByTestId("close-filters-button"));

    // Assert
    expect(clear).not.toHaveBeenCalled();
    expect(resetToProvider).toHaveBeenCalled();
    expect(clearEmpty).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
