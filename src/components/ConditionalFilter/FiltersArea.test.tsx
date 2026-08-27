import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";

import { useConditionalFilterContext } from "./context";
import { FiltersArea } from "./FiltersArea";
import { useFilterContainer } from "./useFilterContainer";

jest.mock("./context", () => ({
  useConditionalFilterContext: jest.fn(),
}));

jest.mock("./useFilterContainer", () => ({
  useFilterContainer: jest.fn(),
}));

jest.mock("./useFilteredOperands", () => ({
  useFilteredOperands: (): unknown[] => [],
}));

jest.mock("./useTranslate", () => ({
  useTranslate: (): {
    translateOperandOptions: <T>(options: T) => T;
    translateSelectedOperands: <T>(value: T) => T;
  } => ({
    translateOperandOptions: <T,>(options: T): T => options,
    translateSelectedOperands: <T,>(value: T): T => value,
  }),
}));

jest.mock("./UI", () => {
  const Footer = ({ children }: { children: ReactNode }): JSX.Element => <div>{children}</div>;
  const Button = ({
    children,
    ...props
  }: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
    "data-test-id"?: string;
  }): JSX.Element => (
    <button type="button" {...props}>
      {children}
    </button>
  );
  const Filters = Object.assign(
    ({ children }: { children: ReactNode }): JSX.Element => <div>{children}</div>,
    {
      Footer,
      AddRowButton: Button,
      ClearButton: Button,
      CloseButton: Button,
      ConfirmButton: Button,
    },
  );

  return { Filters };
});

const mockUseConditionalFilterContext = useConditionalFilterContext as jest.Mock;
const mockUseFilterContainer = useFilterContainer as jest.Mock;

const renderArea = (layout: "popover" | "panel"): void => {
  mockUseConditionalFilterContext.mockReturnValue({
    apiProvider: {},
    leftOperandsProvider: { operands: [] },
    valueProvider: { value: [], count: 0 },
  });
  mockUseFilterContainer.mockReturnValue({
    value: [],
    hasEmptyRows: false,
    addEmpty: jest.fn(),
    removeAt: jest.fn(),
    updateLeftOperator: jest.fn(),
    updateRightOperator: jest.fn(),
    updateCondition: jest.fn(),
    updateRightOptions: jest.fn(),
    fetchRightOptionsList: jest.fn(),
    fetchMoreRightOptions: jest.fn(),
    updateAttribute: jest.fn(),
    fetchAvailableAttributesList: jest.fn(),
    fetchMoreAttributeOptions: jest.fn(),
    updateAvailableAttributesList: jest.fn(),
  });

  render(
    <Wrapper>
      <FiltersArea layout={layout} onConfirm={jest.fn()} onClear={jest.fn()} onCancel={jest.fn()} />
    </Wrapper>,
  );
};

describe("FiltersArea", () => {
  it("reuses Clear filters on the popover and the panel", () => {
    // Arrange & Act
    renderArea("popover");

    // Assert
    expect(screen.getByTestId("reset-all-filters-button")).toHaveTextContent("Clear filters");
    expect(screen.queryByTestId("close-filters-button")).not.toBeInTheDocument();
  });

  it("keeps Close next to the shared Clear filters button on the panel", () => {
    // Arrange & Act
    renderArea("panel");

    // Assert
    expect(screen.getByTestId("reset-all-filters-button")).toHaveTextContent("Clear filters");
    expect(screen.getByTestId("close-filters-button")).toHaveTextContent("Close");
    expect(screen.getByTestId("save-filters-button")).toHaveTextContent("Apply");
  });
});
