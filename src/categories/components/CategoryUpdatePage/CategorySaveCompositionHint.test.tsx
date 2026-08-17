import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { CategorySaveCompositionHint } from "./CategorySaveCompositionHint";
import { type CategorySaveComposition } from "./saveComposition";

const renderHint = (composition?: CategorySaveComposition | null) =>
  render(
    <Wrapper>
      <CategorySaveCompositionHint composition={composition} />
    </Wrapper>,
  );

describe("CategorySaveCompositionHint", () => {
  it("renders nothing when composition is empty", () => {
    // Arrange / Act
    renderHint({ hasGeneral: false });

    // Assert
    expect(screen.queryByTestId("category-save-composition")).not.toBeInTheDocument();
  });

  it("lists dirty category sections", () => {
    // Arrange / Act
    renderHint({ hasGeneral: true });

    // Assert
    const hint = screen.getByTestId("category-save-composition");

    expect(hint).toHaveTextContent("Unsaved changes:");
    expect(hint).toHaveTextContent("general");
  });
});
