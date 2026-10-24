import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps, useState } from "react";

import { AttributeBooleanControl } from "./AttributeBooleanControl";

const renderControl = (props: Partial<ComponentProps<typeof AttributeBooleanControl>> = {}) => {
  const onChange = jest.fn();

  const Harness = () => {
    const [value, setValue] = useState<boolean | null | undefined>(props.value);

    return (
      <AttributeBooleanControl
        name="waterproof"
        label="Waterproof"
        value={value}
        onChange={next => {
          onChange(next);
          setValue(next);
        }}
        {...props}
      />
    );
  };

  render(
    <Wrapper>
      <Harness />
    </Wrapper>,
  );

  return { onChange };
};

describe("AttributeBooleanControl", () => {
  it("selects Yes on click and moves to No with the arrow key", async () => {
    // Arrange
    const user = userEvent.setup();

    renderControl();

    const yes = screen.getByRole("radio", { name: "Yes" });

    // Act
    await user.click(yes);

    // Assert
    expect(yes).toHaveAttribute("aria-checked", "true");

    // Act
    await user.keyboard("{ArrowRight}");

    // Assert
    const no = screen.getByRole("radio", { name: "No" });

    expect(no).toHaveAttribute("aria-checked", "true");
    expect(no).toHaveFocus();

    // Act
    await user.keyboard("{ArrowRight}");

    // Assert
    const notSet = screen.getByRole("radio", { name: "Not set" });

    expect(notSet).toHaveAttribute("aria-checked", "true");
    expect(notSet).toHaveFocus();

    // Act
    await user.keyboard("{ArrowRight}");

    // Assert
    expect(yes).toHaveAttribute("aria-checked", "true");
    expect(yes).toHaveFocus();
  });

  it("renders a required unset value as two invalid choices", () => {
    // Arrange // Act
    renderControl({ required: true, invalid: true });

    // Assert
    const choices = screen.getAllByRole("radio");

    expect(choices).toHaveLength(2);
    expect(choices.every(choice => choice.getAttribute("aria-invalid") === "true")).toBe(true);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-required", "true");
    expect(screen.queryByRole("radio", { name: "Not set" })).not.toBeInTheDocument();
  });
});
