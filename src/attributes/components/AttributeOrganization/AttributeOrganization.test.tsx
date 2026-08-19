import { getAttributePageInitialForm } from "@dashboard/attributes/utils/attributePageForm";
import { AttributeTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AttributeOrganization from "./AttributeOrganization";

const formData = getAttributePageInitialForm(null, AttributeTypeEnum.PRODUCT_TYPE);

describe("AttributeOrganization", () => {
  it("renders organization tiles in a settings card", () => {
    // Arrange & Act
    render(<AttributeOrganization data={formData} disabled={false} onChange={jest.fn()} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByTestId("attribute-organization")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Organization" })).toBeInTheDocument();
    expect(screen.getByTestId(AttributeTypeEnum.PRODUCT_TYPE)).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByTestId(AttributeTypeEnum.PAGE_TYPE)).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("selects model attribute class", async () => {
    // Arrange
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<AttributeOrganization data={formData} disabled={false} onChange={onChange} />, {
      wrapper: Wrapper,
    });

    // Act
    await user.click(screen.getByTestId(AttributeTypeEnum.PAGE_TYPE));

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: { name: "type", value: AttributeTypeEnum.PAGE_TYPE },
    });
  });
});
