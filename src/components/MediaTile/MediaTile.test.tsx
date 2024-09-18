import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import MediaTile, { MediaTileProps } from "./MediaTile";

const mockMedia = {
  alt: "Sample Image",
  url: "https://example.image.com/150",
};

const renderComponent = (props: Partial<MediaTileProps> = {}) => {
  return render(
    <Router>
      <MediaTile media={mockMedia} {...props} />
    </Router>,
  );
};

describe("MediaTile", () => {
  it("renders the image with alt text", () => {
    renderComponent();

    const img = screen.getByAltText("Sample Image");

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.image.com/150");
  });

  it("shows spinner when loading is true", () => {
    renderComponent({ loading: true });

    const spinner = screen.getByTestId("spinner");

    expect(spinner).toBeInTheDocument();
  });

  it("shows edit and delete buttons when hovered", () => {
    renderComponent({ onEdit: jest.fn(), onDelete: jest.fn() });

    const container = screen.getByTestId("product-image");

    fireEvent.mouseEnter(container);

    const editButton = screen.getByTestId("edit-button");
    const deleteButton = screen.getByTestId("delete-button");

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    const onEdit = jest.fn();

    renderComponent({ onEdit });

    const container = screen.getByTestId("product-image");

    fireEvent.mouseEnter(container);

    const editButton = screen.getByTestId("edit-button");

    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalled();
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = jest.fn();

    renderComponent({ onDelete });

    const container = screen.getByTestId("product-image");

    fireEvent.mouseEnter(container);

    const deleteButton = screen.getByTestId("delete-button");

    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalled();
  });

  it("renders edit button as a link when editHref is provided", () => {
    renderComponent({ editHref: "/edit" });

    const container = screen.getByTestId("product-image");

    fireEvent.mouseEnter(container);

    const editLink = screen.getByTestId("edit-link");

    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute("href", "/edit");
  });
});
