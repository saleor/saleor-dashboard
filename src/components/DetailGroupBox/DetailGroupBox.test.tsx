import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DetailGroupBox } from "./DetailGroupBox";

describe("DetailGroupBox", () => {
  it("exposes expanded state and opens when the trigger is clicked", async () => {
    // Arrange
    render(
      <DetailGroupBox
        groupId="seo-form"
        dataTestId="seo-form"
        triggerButtonTestId="edit-seo"
        headerStart="SEO"
      >
        <div>SEO fields</div>
      </DetailGroupBox>,
      { wrapper: Wrapper },
    );

    const section = screen.getByTestId("seo-form");

    expect(section).toHaveAttribute("data-expanded", "false");
    expect(screen.queryByText("SEO fields")).not.toBeInTheDocument();

    // Act
    await userEvent.click(screen.getByTestId("edit-seo"));

    // Assert
    expect(section).toHaveAttribute("data-expanded", "true");
    expect(screen.getByText("SEO fields")).toBeInTheDocument();
  });

  it("tints a flush header only while the group is open", async () => {
    // Arrange
    render(
      <DetailGroupBox
        groupId="related"
        variant="flush"
        dataTestId="related"
        triggerButtonTestId="related-expand"
        headerStart="Related products"
      >
        <div>References</div>
      </DetailGroupBox>,
      { wrapper: Wrapper },
    );

    const section = screen.getByTestId("related");

    // Assert — collapsed rows stay on the card body
    expect(section).toHaveAttribute("data-expanded", "false");
    expect(section.querySelector("[class*='headerFlushExpanded']")).not.toBeInTheDocument();

    // Act
    await userEvent.click(screen.getByTestId("related-expand"));

    // Assert
    expect(section).toHaveAttribute("data-expanded", "true");
    expect(section.querySelector("[class*='headerFlushExpanded']")).toBeInTheDocument();
    expect(section.querySelector("[data-group-header]")).toBeInTheDocument();
  });
});
