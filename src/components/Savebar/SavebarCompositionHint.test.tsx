import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { SavebarCompositionHint } from "./SavebarCompositionHint";

describe("SavebarCompositionHint", () => {
  it("renders nothing when there are no segments", () => {
    // Arrange / Act
    render(
      <Wrapper>
        <SavebarCompositionHint segments={[]} data-test-id="save-composition" />
      </Wrapper>,
    );

    // Assert
    expect(screen.queryByTestId("save-composition")).not.toBeInTheDocument();
  });

  it("lists dirty segments", () => {
    // Arrange / Act
    render(
      <Wrapper>
        <SavebarCompositionHint
          segments={["general", "channel availability"]}
          data-test-id="save-composition"
        />
      </Wrapper>,
    );

    // Assert
    const hint = screen.getByTestId("save-composition");

    expect(hint).toHaveTextContent("Unsaved changes:");
    expect(hint).toHaveTextContent("general");
    expect(hint).toHaveTextContent("channel availability");
  });
});
