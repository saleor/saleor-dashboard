import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { ConstraintReasonHint } from "./ConstraintReasonHint";

describe("ConstraintReasonHint", () => {
  it("exposes a single dependent field on the icon", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <ConstraintReasonHint fields={["Price"]} />
      </Wrapper>,
    );

    // Assert
    expect(
      screen.getByRole("button", { name: "Needed for filtering on Price" }),
    ).toBeInTheDocument();
  });

  it("joins several dependent fields", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <ConstraintReasonHint fields={["Price", "Is published", "Is available"]} />
      </Wrapper>,
    );

    // Assert
    expect(
      screen.getByRole("button", {
        name: "Needed for filtering on Price, Is published, and Is available",
      }),
    ).toBeInTheDocument();
  });

  it("renders nothing without dependents", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <ConstraintReasonHint fields={[]} />
      </Wrapper>,
    );

    // Assert
    expect(
      screen.queryByRole("button", { name: /Needed for filtering on/ }),
    ).not.toBeInTheDocument();
  });
});
