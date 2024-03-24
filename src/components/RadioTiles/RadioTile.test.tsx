import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { render, screen } from "@testing-library/react";
import React from "react";

import { RadioTile } from "./RadioTile";

describe("RadioTile", () => {
  it("renders the title and description", () => {
    // Arrange
    const props = {
      checked: false,
      title: "Test Title",
      description: "Test Description",
      value: "test",
    };

    // Act
    render(
      <RadixRadioGroup.Root>
        <RadioTile {...props} />
      </RadixRadioGroup.Root>,
    );

    // Assert
    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();
  });
});
