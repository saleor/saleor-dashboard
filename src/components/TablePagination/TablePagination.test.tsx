import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { ListSettings } from "../../types";
import { TablePagination } from "./TablePagination";

jest.mock("react-intl", () => ({
  useIntl: () => ({
    formatMessage: () => "Rows per page",
  }),
  defineMessages: (x: any) => x,
}));

const mockNavigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => mockNavigate);

describe("TablePagination", () => {
  const defaultProps = {
    hasNextPage: true,
    hasPreviousPage: true,
    disabled: false,
  };

  it("renders pagination without settings", () => {
    // Arrange
    render(<TablePagination {...defaultProps} />);

    // Assert
    expect(screen.getByTestId("button-pagination-back")).toBeInTheDocument();
    expect(screen.getByTestId("button-pagination-next")).toBeInTheDocument();
    expect(screen.queryByText("Rows per page")).not.toBeInTheDocument();
  });

  it("renders pagination with row number selector", () => {
    // Arrange
    const settings: ListSettings = {
      rowNumber: 20,
    };

    // Act
    render(<TablePagination {...defaultProps} settings={settings} />);

    // Assert
    expect(screen.getByText("Rows per page")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("disables navigation based on hasNextPage/hasPreviousPage flags", () => {
    // Arrange
    render(<TablePagination {...defaultProps} hasNextPage={false} hasPreviousPage={false} />);

    // Assert
    expect(screen.getByTestId("button-pagination-back")).toBeDisabled();
    expect(screen.getByTestId("button-pagination-next")).toBeDisabled();
  });

  it("uses custom labels for row number selector", () => {
    // Arrange
    const settings: ListSettings = {
      rowNumber: 20,
    };
    const customLabels = {
      noOfRows: "Custom label",
    };

    // Act
    render(<TablePagination {...defaultProps} settings={settings} labels={customLabels} />);

    // Assert
    expect(screen.getByText("Custom label")).toBeInTheDocument();
  });

  it("uses history.push for navigation with href props", () => {
    // Arrange
    render(<TablePagination {...defaultProps} prevHref="/prev" nextHref="/next" />);

    // Act & Assert
    fireEvent.click(screen.getByTestId("button-pagination-next"));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/next");

    fireEvent.click(screen.getByTestId("button-pagination-back"));
    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenCalledWith("/prev");
  });
});
