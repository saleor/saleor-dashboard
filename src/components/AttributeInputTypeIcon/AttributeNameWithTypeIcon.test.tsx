import { AttributeInputTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { AttributeNameWithTypeIcon } from "./AttributeNameWithTypeIcon";

describe("AttributeNameWithTypeIcon", () => {
  it("renders the name without secondary text", () => {
    // Arrange & Act
    render(<AttributeNameWithTypeIcon name="Package weight" />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByText("Package weight")).toBeInTheDocument();
    expect(screen.queryByTestId("slug")).not.toBeInTheDocument();
  });

  it("renders slug as secondary text under the name", () => {
    // Arrange & Act
    render(
      <AttributeNameWithTypeIcon
        name="Package weight"
        inputType={AttributeInputTypeEnum.DROPDOWN}
        secondary="package-weight"
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByText("Package weight")).toBeInTheDocument();
    expect(screen.getByTestId("slug")).toHaveTextContent("package-weight");
  });
});
