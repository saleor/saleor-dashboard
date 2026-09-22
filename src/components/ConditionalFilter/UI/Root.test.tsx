import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { type ConditionalFiltersLayout, Root } from "./Root";

const locale = {
  WHERE: "Where",
  AND: "And",
  OR: "Or",
  noValueText: "No filters",
};

const renderRoot = (layout: ConditionalFiltersLayout): void => {
  render(
    <Wrapper>
      <Root value={[]} leftOptions={[]} layout={layout} locale={locale} />
    </Wrapper>,
  );
};

describe("Filters empty state", () => {
  it.each<ConditionalFiltersLayout>(["popover", "inline", "panel"])(
    "shows No filters when %s has no conditions",
    layout => {
      // Arrange // Act
      renderRoot(layout);

      // Assert
      expect(screen.getByTestId("filters-empty-state")).toHaveTextContent("No filters");
    },
  );
});
