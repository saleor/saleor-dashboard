import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { Pagination, PaginationProps } from "./Pagination";

const defaultProps = {
  hasNextPage: true,
  hasPreviousPage: true,
  paginatorSettings: {
    loadNextPage: jest.fn(),
    loadPreviousPage: jest.fn(),
    paginatorType: "click" as const,
  },
};

jest.mock("react-router-dom", () => ({
  Link: jest.fn(({ to, ...props }) => <a href={to} {...props} />),
}));

jest.mock("react-intl", () => ({
  FormattedMessage: ({ defaultMessage }: { defaultMessage: any }) => <>{defaultMessage}</>,
}));

describe("Pagination", () => {
  it("renders navigation buttons", () => {
    // Arrange
    render(<Pagination {...defaultProps} />);

    // Assert
    expect(screen.getByTestId("button-pagination-back")).toBeInTheDocument();
    expect(screen.getByTestId("button-pagination-next")).toBeInTheDocument();
  });

  describe("click pagination type", () => {
    it("calls loadNextPage/loadPreviousPage when buttons are clicked", () => {
      // Arrange
      render(<Pagination {...defaultProps} />);

      // Act
      fireEvent.click(screen.getByTestId("button-pagination-next"));
      fireEvent.click(screen.getByTestId("button-pagination-back"));

      // Assert
      expect(defaultProps.paginatorSettings.loadNextPage).toHaveBeenCalled();
      expect(defaultProps.paginatorSettings.loadPreviousPage).toHaveBeenCalled();
    });
  });

  describe("url pagination type", () => {
    // Arrange
    const urlProps = {
      ...defaultProps,
      paginatorSettings: {
        paginatorType: "link",
        nextHref: "/next",
        prevHref: "/prev",
      },
    } satisfies PaginationProps;

    it("renders Links with correct hrefs", () => {
      // Arrange
      render(<Pagination {...urlProps} />);

      // Act
      const links = screen.getAllByRole("link");

      // Assert
      expect(links[0]).toHaveAttribute("href", "/prev");
      expect(links[1]).toHaveAttribute("href", "/next");
    });
  });

  describe("row number selection", () => {
    it("shows row selector when numberOfRows provided", () => {
      // Arrange
      render(<Pagination {...defaultProps} numberOfRows={20} />);

      // Assert
      expect(screen.getByTestId("select-rows-per-page")).toBeInTheDocument();
    });

    it("hides row selector when numberOfRows not provided", () => {
      // Arrange
      render(<Pagination {...defaultProps} />);

      // Assert
      expect(screen.queryByTestId("select-rows-per-page")).not.toBeInTheDocument();
    });

    it("calls onUpdateListSettings when row number changed", () => {
      // Arrange
      const onUpdateListSettings = jest.fn();

      render(
        <Pagination
          {...defaultProps}
          numberOfRows={20}
          onUpdateListSettings={onUpdateListSettings}
        />,
      );

      // Act
      const select = screen.getByTestId("select-rows-per-page");

      fireEvent.click(select);
      fireEvent.click(screen.getByText("50"));

      // Assert
      expect(onUpdateListSettings).toHaveBeenCalledWith("rowNumber", 50);
    });
  });

  describe("disabled states", () => {
    it("disables buttons when hasNextPage/hasPreviousPage is false", () => {
      // Arrange
      render(<Pagination {...defaultProps} hasNextPage={false} hasPreviousPage={false} />);

      // Assert
      expect(screen.getByTestId("button-pagination-back")).toBeDisabled();
      expect(screen.getByTestId("button-pagination-next")).toBeDisabled();
    });

    it("disables buttons when disabled prop is true", () => {
      // Arrange
      render(<Pagination {...defaultProps} disabled={true} />);

      // Assert
      expect(screen.getByTestId("button-pagination-back")).toBeDisabled();
      expect(screen.getByTestId("button-pagination-next")).toBeDisabled();
    });
  });
});
