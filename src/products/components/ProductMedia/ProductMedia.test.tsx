import { ProductMediaType } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import ProductMedia from "./ProductMedia";

const TestWrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <MemoryRouter>
    <Wrapper>{children}</Wrapper>
  </MemoryRouter>
);

const savedMedia = {
  __typename: "ProductMedia" as const,
  id: "media-1",
  alt: "Existing",
  sortOrder: 0,
  type: ProductMediaType.IMAGE,
  url: "https://example.com/existing.png",
  oembedData: null,
};

describe("ProductMedia", () => {
  const createObjectURL = jest.fn(() => "blob:pending-preview");
  const revokeObjectURL = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      writable: true,
      value: revokeObjectURL,
    });
  });

  it("shows uploading tiles immediately when files are selected on an empty gallery", async () => {
    // Arrange
    let resolveUpload: (value?: unknown) => void = () => undefined;
    const onImageUpload = jest.fn(
      () =>
        new Promise(resolve => {
          resolveUpload = resolve;
        }),
    );

    const { rerender } = render(
      <TestWrapper>
        <ProductMedia
          media={[]}
          getImageEditUrl={(id): string => `/media/${id}`}
          onImageDelete={() => () => undefined}
          onImageUpload={onImageUpload}
          openMediaUrlModal={() => undefined}
        />
      </TestWrapper>,
    );

    expect(screen.getByTestId("product-media-dropzone")).toBeInTheDocument();

    const file = new File(["image-bytes"], "shoe.png", { type: "image/png" });
    const input = screen.getByTestId("product-media-file-input");

    // Act
    await userEvent.upload(input, file);

    // Assert — pending tile appears before the upload promise resolves
    expect(createObjectURL).toHaveBeenCalledWith(file);
    expect(screen.getByTestId("product-media-gallery")).toBeInTheDocument();
    expect(screen.getByTestId("media-tile-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("product-media-dropzone")).not.toBeInTheDocument();
    expect(onImageUpload).toHaveBeenCalledWith(file, 0);

    // Act — upload finishes, but saved media has not arrived yet
    await act(async () => {
      resolveUpload();
    });

    // Assert — keep the pending tile until media prop updates (no empty flash)
    expect(screen.getByTestId("media-tile-loading")).toBeInTheDocument();

    // Act — Apollo cache delivers the saved media
    rerender(
      <TestWrapper>
        <ProductMedia
          media={[
            {
              __typename: "ProductMedia",
              id: "media-uploaded",
              alt: "",
              sortOrder: 0,
              type: ProductMediaType.IMAGE,
              url: "https://example.com/uploaded.png",
              oembedData: null,
            },
          ]}
          getImageEditUrl={(id): string => `/media/${id}`}
          onImageDelete={() => () => undefined}
          onImageUpload={onImageUpload}
          openMediaUrlModal={() => undefined}
        />
      </TestWrapper>,
    );

    // Assert — pending uploading tile is gone; local blob is kept as placeholder
    expect(screen.queryByTestId("media-tile-loading")).not.toBeInTheDocument();
    expect(screen.getByTestId("product-image")).toBeInTheDocument();
    expect(screen.getByTestId("media-placeholder")).toHaveAttribute("src", "blob:pending-preview");
    expect(revokeObjectURL).not.toHaveBeenCalled();

    // Act — remote image finishes loading
    const remoteImage = document.querySelector(
      'img[src="https://example.com/uploaded.png"]',
    ) as HTMLImageElement;

    fireEvent.load(remoteImage);

    await waitFor(() => {
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:pending-preview");
    });
    expect(screen.queryByTestId("media-placeholder")).not.toBeInTheDocument();
  });

  it("appends uploading tiles next to existing media", async () => {
    // Arrange
    const onImageUpload = jest.fn(() => new Promise(() => undefined));

    render(
      <TestWrapper>
        <ProductMedia
          media={[savedMedia]}
          getImageEditUrl={(id): string => `/media/${id}`}
          onImageDelete={() => () => undefined}
          onImageUpload={onImageUpload}
          openMediaUrlModal={() => undefined}
        />
      </TestWrapper>,
    );

    const file = new File(["image-bytes"], "new.png", { type: "image/png" });
    const input = screen.getByTestId("product-media-file-input");

    // Act
    await userEvent.upload(input, file);

    // Assert
    expect(screen.getAllByTestId("product-image")).toHaveLength(2);
    expect(screen.getByTestId("media-tile-loading")).toBeInTheDocument();
  });

  it("removes the pending tile when upload fails", async () => {
    // Arrange
    const onImageUpload = jest.fn(() => Promise.reject(new Error("network")));

    jest.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <TestWrapper>
        <ProductMedia
          media={[]}
          getImageEditUrl={(id): string => `/media/${id}`}
          onImageDelete={() => () => undefined}
          onImageUpload={onImageUpload}
          openMediaUrlModal={() => undefined}
        />
      </TestWrapper>,
    );

    const file = new File(["image-bytes"], "shoe.png", { type: "image/png" });
    const input = screen.getByTestId("product-media-file-input");

    // Act
    await userEvent.upload(input, file);

    // Assert
    await waitFor(() => {
      expect(screen.queryByTestId("media-tile-loading")).not.toBeInTheDocument();
    });
    expect(screen.getByTestId("product-media-dropzone")).toBeInTheDocument();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:pending-preview");
  });
});
