import { getAttributePageInitialForm } from "@dashboard/attributes/utils/attributePageForm";
import { AttributeInputTypeEnum, AttributeTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AttributeProperties from "./AttributeProperties";

const formData = getAttributePageInitialForm();

describe("AttributeProperties", () => {
  it("renders properties as a settings card with toggle rows", () => {
    // Arrange & Act
    render(
      <AttributeProperties data={formData} disabled={false} errors={[]} onChange={jest.fn()} />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("attribute-properties")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Properties" })).toBeInTheDocument();
    expect(screen.getByTestId("attribute-value-required")).toBeInTheDocument();
    expect(screen.getByTestId("attribute-visible-in-storefront")).toBeInTheDocument();
    expect(screen.getByTestId("attribute-filterable-in-storefront")).toBeInTheDocument();
  });

  it("toggles value required", async () => {
    // Arrange
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(
      <AttributeProperties data={formData} disabled={false} errors={[]} onChange={onChange} />,
      { wrapper: Wrapper },
    );

    // Act
    await user.click(screen.getByRole("button", { name: /Value Required/i }));

    // Assert
    expect(onChange).toHaveBeenCalledWith({
      target: { name: "valueRequired", value: false },
    });
  });

  it("shows faceted navigation position when filterable is on", () => {
    // Arrange & Act
    render(
      <AttributeProperties
        data={{
          ...formData,
          inputType: AttributeInputTypeEnum.DROPDOWN,
          type: AttributeTypeEnum.PRODUCT_TYPE,
          filterableInStorefront: true,
          storefrontSearchPosition: "2",
        }}
        disabled={false}
        errors={[]}
        onChange={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByLabelText("Position in faceted navigation")).toHaveValue("2");
  });

  it("hides storefront filter settings for model attributes", () => {
    // Arrange & Act
    render(
      <AttributeProperties
        data={{
          ...formData,
          type: AttributeTypeEnum.PAGE_TYPE,
        }}
        disabled={false}
        errors={[]}
        onChange={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.queryByTestId("attribute-filterable-in-storefront")).not.toBeInTheDocument();
  });
});
