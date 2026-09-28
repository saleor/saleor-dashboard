import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import { type ListSettings } from "../../types";
import { TablePagination } from "./TablePagination";

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
    render(
      <Wrapper>
        <TablePagination {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("button-pagination-back")).toBeInTheDocument();
    expect(screen.getByTestId("button-pagination-next")).toBeInTheDocument();
    expect(screen.queryByText("No. of rows")).not.toBeInTheDocument();
  });

  it("renders pagination with row number selector", () => {
    // Arrange
    const settings: ListSettings = {
      rowNumber: 20,
    };

    // Act
    render(
      <Wrapper>
        <TablePagination {...defaultProps} settings={settings} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("No. of rows")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("disables navigation based on hasNextPage/hasPreviousPage flags", () => {
    // Arrange
    render(
      <Wrapper>
        <TablePagination {...defaultProps} hasNextPage={false} hasPreviousPage={false} />
      </Wrapper>,
    );

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
    render(
      <Wrapper>
        <TablePagination {...defaultProps} settings={settings} labels={customLabels} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Custom label")).toBeInTheDocument();
  });

  it("uses history.push for navigation with href props", () => {
    // Arrange
    render(
      <Wrapper>
        <TablePagination {...defaultProps} prevHref="/prev" nextHref="/next" />
      </Wrapper>,
    );

    // Act & Assert
    fireEvent.click(screen.getByTestId("button-pagination-next"));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/next");

    fireEvent.click(screen.getByTestId("button-pagination-back"));
    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenCalledWith("/prev");
  });
});
