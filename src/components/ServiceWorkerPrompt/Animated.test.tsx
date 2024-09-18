import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { Animated } from "./Animated";

describe("Animated Component", () => {
  test("renders children when show is true", () => {
    // Arrange & Act
    render(<Animated show={true}>Test Child</Animated>);

    // Assert
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  test("does not render children when show is false", () => {
    // Arrange & Act
    const { rerender } = render(<Animated show={false}>Test Child</Animated>);

    // Assert
    expect(screen.queryByText("Test Child")).not.toBeInTheDocument();

    // Arrange & Act
    rerender(<Animated show={true}>Test Child</Animated>);

    // Assert
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  test("handles transition end correctly", () => {
    // Arrange & Act
    const { rerender } = render(<Animated show={false}>Test Child</Animated>);

    rerender(<Animated show={true}>Test Child</Animated>);

    // Assert
    expect(screen.getByText("Test Child")).toBeInTheDocument();

    // Arrange & Act
    rerender(<Animated show={false}>Test Child</Animated>);
    fireEvent.transitionEnd(screen.getByText("Test Child"));

    // Assert
    expect(screen.queryByText("Test Child")).not.toBeInTheDocument();
  });
});
