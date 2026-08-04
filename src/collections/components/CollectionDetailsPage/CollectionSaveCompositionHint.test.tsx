import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { CollectionSaveCompositionHint } from "./CollectionSaveCompositionHint";
import { type CollectionSaveComposition } from "./saveComposition";

const renderHint = (composition?: CollectionSaveComposition | null) =>
  render(
    <Wrapper>
      <CollectionSaveCompositionHint composition={composition} />
    </Wrapper>,
  );

describe("CollectionSaveCompositionHint", () => {
  it("renders nothing when composition is empty", () => {
    // Arrange / Act
    renderHint({
      hasGeneral: false,
      hasChannels: false,
    });

    // Assert
    expect(screen.queryByTestId("collection-save-composition")).not.toBeInTheDocument();
  });

  it("lists dirty collection sections", () => {
    // Arrange / Act
    renderHint({
      hasGeneral: true,
      hasChannels: true,
    });

    // Assert
    const hint = screen.getByTestId("collection-save-composition");

    expect(hint).toHaveTextContent("Unsaved changes:");
    expect(hint).toHaveTextContent("general");
    expect(hint).toHaveTextContent("channel availability");
  });
});
