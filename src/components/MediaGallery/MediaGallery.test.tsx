import Wrapper from "@test/wrapper";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { MediaGallery } from "./MediaGallery";
import { type GalleryMedia } from "./types";

const TestWrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <MemoryRouter>
    <Wrapper>{children}</Wrapper>
  </MemoryRouter>
);

const savedMedia: GalleryMedia = {
  id: "media-1",
  alt: "Existing",
  sortOrder: 0,
  type: "IMAGE",
  url: "https://example.com/existing.png",
  oembedData: "{}",
};

describe("MediaGallery", () => {
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

  it("uses the aligned detail-card shell", () => {
    // Arrange / Act
    render(
      <TestWrapper>
        <MediaGallery
          media={[savedMedia]}
          onImageDelete={() => () => undefined}
          onImagesDelete={() => undefined}
          onImageUpload={async () => undefined}
          openMediaUrlModal={() => undefined}
        />
      </TestWrapper>,
    );

    // Assert
    const gallery = screen.getByTestId("product-media");

    expect(gallery).toHaveClass("card");
    expect(within(gallery).getByRole("heading", { name: "Media" })).toBeInTheDocument();
  });

  it("shows uploading tiles immediately when files are selected on an empty gallery", async () => {
    // Arrange
    let resolveUpload: (value: string | undefined) => void = () => undefined;
    const onImageUpload = jest.fn(
      (): Promise<string | undefined> =>
        new Promise(resolve => {
          resolveUpload = resolve;
        }),
    );
    const onImagesUploadComplete = jest.fn();

    const { rerender } = render(
      <TestWrapper>
        <MediaGallery
          media={[]}
          getImageEditUrl={(id): string => `/media/${id}`}
          onImageDelete={() => () => undefined}
          onImagesDelete={() => undefined}
          onImageUpload={onImageUpload}
          onImagesUploadComplete={onImagesUploadComplete}
          openMediaUrlModal={() => undefined}
        />
      </TestWrapper>,
    );

    expect(screen.getByTestId("product-media")).toBeInTheDocument();
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

    // Act — upload finishes with created media id, but saved media has not arrived yet
    await act(async () => {
      resolveUpload("media-uploaded");
    });

    // Assert — keep the pending tile until media prop updates (no empty flash)
    expect(screen.getByTestId("media-tile-loading")).toBeInTheDocument();
    await waitFor(() => {
      expect(onImagesUploadComplete).toHaveBeenCalledWith({
        successCount: 1,
        failureCount: 0,
      });
    });

    // Act — Apollo cache delivers the saved media
    rerender(
      <TestWrapper>
        <MediaGallery
          media={[
            {
              id: "media-uploaded",
              alt: "",
              sortOrder: 0,
              type: "IMAGE",
              url: "https://example.com/uploaded.png",
              oembedData: "{}",
            },
          ]}
          getImageEditUrl={(id): string => `/media/${id}`}
          onImageDelete={() => () => undefined}
          onImagesDelete={() => undefined}
          onImageUpload={onImageUpload}
          onImagesUploadComplete={onImagesUploadComplete}
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
    const onImageUpload = jest.fn((): Promise<string | undefined> => new Promise(() => undefined));

    render(
      <TestWrapper>
        <MediaGallery
          media={[savedMedia]}
          getImageEditUrl={(id): string => `/media/${id}`}
          onImageDelete={() => () => undefined}
          onImagesDelete={() => undefined}
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

  it("calls onImagesDelete with selected media ids", async () => {
    // Arrange
    const onImagesDelete = jest.fn();
    const secondMedia = {
      ...savedMedia,
      id: "media-2",
      url: "https://example.com/second.png",
    };

    render(
      <TestWrapper>
        <MediaGallery
          media={[savedMedia, secondMedia]}
          getImageEditUrl={(id): string => `/media/${id}`}
          onImageDelete={() => () => undefined}
          onImagesDelete={onImagesDelete}
          onImageUpload={jest.fn((): Promise<string | undefined> => Promise.resolve("unused"))}
          openMediaUrlModal={() => undefined}
        />
      </TestWrapper>,
    );

    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const selectionControls = screen.getAllByTestId("product-media-select");

    // Act — checkboxes are hover-only in the UI; jsdom does not apply :hover
    await user.click(within(selectionControls[0]).getByRole("checkbox"));
    await user.click(within(selectionControls[1]).getByRole("checkbox"));
    await user.click(screen.getByTestId("product-media-delete-selected"));

    // Assert
    expect(onImagesDelete).toHaveBeenCalledWith(["media-1", "media-2"]);
  });

  it("removes the pending tile when upload fails", async () => {
    // Arrange
    const onImageUpload = jest.fn(
      (): Promise<string | undefined> => Promise.reject(new Error("network")),
    );
    const onImagesUploadComplete = jest.fn();

    jest.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <TestWrapper>
        <MediaGallery
          media={[]}
          getImageEditUrl={(id): string => `/media/${id}`}
          onImageDelete={() => () => undefined}
          onImagesDelete={() => undefined}
          onImageUpload={onImageUpload}
          onImagesUploadComplete={onImagesUploadComplete}
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
    expect(onImagesUploadComplete).toHaveBeenCalledWith({
      successCount: 0,
      failureCount: 1,
    });
  });

  it("skips invalid files and uploads only valid images", async () => {
    // Arrange
    const onImageUpload = jest.fn(() => Promise.resolve("media-new"));

    render(
      <TestWrapper>
        <MediaGallery
          media={[savedMedia]}
          getImageEditUrl={(id): string => `/media/${id}`}
          onImageDelete={() => () => undefined}
          onImagesDelete={() => undefined}
          onImageUpload={onImageUpload}
          openMediaUrlModal={() => undefined}
        />
      </TestWrapper>,
    );

    const pdf = new File(["pdf-bytes"], "doc.pdf", { type: "application/pdf" });
    const image = new File(["image-bytes"], "new.png", { type: "image/png" });
    const input = screen.getByTestId("product-media-file-input");

    // Act
    await userEvent.upload(input, [pdf, image]);

    // Assert
    expect(onImageUpload).toHaveBeenCalledTimes(1);
    expect(onImageUpload).toHaveBeenCalledWith(image, 0);
    expect(screen.getByTestId("media-tile-loading")).toBeInTheDocument();
  });
  it("renders without an update loop while media is still loading", () => {
    // Arrange
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);

    // Act
    const { rerender } = render(
      <TestWrapper>
        <MediaGallery
          media={undefined}
          getImageEditUrl={(id): string => `/media/${id}`}
          onImageDelete={() => () => undefined}
          onImagesDelete={() => undefined}
          onImageUpload={jest.fn()}
          openMediaUrlModal={() => undefined}
        />
      </TestWrapper>,
    );

    // A re-render while media is still undefined is what kicks off the loop.
    // A regression here does not fail an assertion - it hangs this test.
    rerender(
      <TestWrapper>
        <MediaGallery
          media={undefined}
          getImageEditUrl={(id): string => `/media/${id}`}
          onImageDelete={() => () => undefined}
          onImagesDelete={() => undefined}
          onImageUpload={jest.fn()}
          openMediaUrlModal={() => undefined}
        />
      </TestWrapper>,
    );

    // Assert
    expect(
      consoleError.mock.calls.some(call => String(call[0]).includes("Maximum update depth")),
    ).toBe(false);

    consoleError.mockRestore();
  });
});
