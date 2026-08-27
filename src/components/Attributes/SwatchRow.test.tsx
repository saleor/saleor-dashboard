import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { type AttributeInput } from "./Attributes";
import { SwatchRow } from "./SwatchRow";

const intersectionObserverMock = (): {
  observe: () => null;
  unobserve: () => null;
  disconnect: () => null;
} => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

const swatchAttribute: AttributeInput = {
  data: {
    inputType: AttributeInputTypeEnum.SWATCH,
    isRequired: true,
    values: [
      {
        __typename: "AttributeValue",
        file: null,
        id: "navy",
        name: "Navy blue",
        reference: null,
        plainText: null,
        richText: null,
        boolean: null,
        slug: "navy-blue",
        date: null,
        dateTime: null,
        value: "#001f54",
      },
      {
        __typename: "AttributeValue",
        file: null,
        id: "gray",
        name: "Gray",
        reference: null,
        plainText: null,
        richText: null,
        boolean: null,
        slug: "gray",
        date: null,
        dateTime: null,
        value: "#6b7280",
      },
    ],
  },
  id: "color-attribute",
  label: "Color",
  value: ["navy-blue"],
};

describe("SwatchRow", () => {
  it("keeps option swatch wrappers decorative so labels stay next to the circle", () => {
    // Arrange
    render(
      <SwatchRow
        attribute={swatchAttribute}
        attributeValues={[]}
        disabled={false}
        error={undefined}
        onChange={jest.fn()}
        fetchAttributeValues={jest.fn()}
        fetchMoreAttributeValues={{
          hasMore: false,
          loading: false,
          onFetchMore: jest.fn(),
          totalCount: 0,
        }}
      />,
    );

    // Act
    fireEvent.click(screen.getByRole("combobox"));

    // Assert
    const option = screen.getByRole("option", { name: "Gray" });
    const swatch = within(option).getByTestId("swatch-preview");

    expect(swatch).toHaveStyle({ backgroundColor: "#6b7280" });
    expect(swatch.parentElement).toHaveAttribute("aria-hidden", "true");
  });
});
