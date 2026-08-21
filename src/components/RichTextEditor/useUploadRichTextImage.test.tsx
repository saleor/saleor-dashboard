import { useFileUploadMutation } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react";

import {
  ALLOWED_RICH_TEXT_IMAGE_MIME_TYPES,
  MAX_RICH_TEXT_IMAGE_SIZE_BYTES,
  useUploadRichTextImage,
  validateRichTextImage,
} from "./useUploadRichTextImage";

jest.mock("@dashboard/graphql", () => ({
  useFileUploadMutation: jest.fn(),
}));

jest.mock("@dashboard/intl", () => ({
  errorMessages: {
    imgageUploadErrorTitle: "Image upload error title",
    imageUploadErrorText: "Image upload error text",
  },
}));

const notifyMock = jest.fn();

jest.mock("@dashboard/hooks/useNotifier", () => ({
  useNotifier: () => notifyMock,
}));

const makeFile = (type: string, size: number): File => {
  // Arrange a File whose reported size matches `size` without allocating memory.
  const file = new File(["x"], "example", { type });

  Object.defineProperty(file, "size", { value: size });

  return file;
};

describe("validateRichTextImage", () => {
  it("accepts every allowed mime type under the size cap", () => {
    // Act / Assert
    for (const type of ALLOWED_RICH_TEXT_IMAGE_MIME_TYPES) {
      expect(validateRichTextImage(makeFile(type, 1024))).toBeNull();
    }
  });

  it("rejects disallowed mime types (e.g. SVG)", () => {
    // Act / Assert
    expect(validateRichTextImage(makeFile("image/svg+xml", 1024))).toBe("invalidType");
    expect(validateRichTextImage(makeFile("application/pdf", 1024))).toBe("invalidType");
  });

  it("rejects files larger than the size cap", () => {
    // Act / Assert
    expect(validateRichTextImage(makeFile("image/png", MAX_RICH_TEXT_IMAGE_SIZE_BYTES + 1))).toBe(
      "tooLarge",
    );
  });
});

describe("useUploadRichTextImage", () => {
  const mockUploadFile = jest.fn();

  beforeEach(() => {
    (useFileUploadMutation as jest.Mock).mockReturnValue([mockUploadFile]);
    jest.clearAllMocks();
  });

  it("returns success and the uploaded url on a successful upload", async () => {
    // Arrange
    const { result } = renderHook(() => useUploadRichTextImage());
    const file = makeFile("image/png", 1024);

    mockUploadFile.mockResolvedValueOnce({
      data: {
        fileUpload: {
          errors: [],
          uploadedFile: { url: "http://example.com/example.png", contentType: "image/png" },
        },
      },
    });

    // Act
    let response;

    await act(async () => {
      response = await result.current(file);
    });

    // Assert
    expect(mockUploadFile).toHaveBeenCalledWith({ variables: { file } });
    expect(response).toEqual({ success: 1, file: { url: "http://example.com/example.png" } });
    expect(notifyMock).not.toHaveBeenCalled();
  });

  it("returns failure and notifies when the backend returns errors", async () => {
    // Arrange
    const { result } = renderHook(() => useUploadRichTextImage());
    const file = makeFile("image/png", 1024);

    mockUploadFile.mockResolvedValueOnce({
      data: { fileUpload: { errors: [{ message: "Upload error" }] } },
    });

    // Act
    let response;

    await act(async () => {
      response = await result.current(file);
    });

    // Assert
    expect(response).toEqual({ success: 0, file: { url: "" } });
    expect(notifyMock).toHaveBeenCalledWith(expect.objectContaining({ status: "error" }));
  });

  it("returns failure and notifies when the mutation throws", async () => {
    // Arrange
    const { result } = renderHook(() => useUploadRichTextImage());
    const file = makeFile("image/png", 1024);

    mockUploadFile.mockRejectedValueOnce(new Error("network"));

    // Act
    let response;

    await act(async () => {
      response = await result.current(file);
    });

    // Assert
    expect(response).toEqual({ success: 0, file: { url: "" } });
    expect(notifyMock).toHaveBeenCalledWith(expect.objectContaining({ status: "error" }));
  });

  it("rejects invalid mime types without calling the mutation", async () => {
    // Arrange
    const { result } = renderHook(() => useUploadRichTextImage());
    const file = makeFile("image/svg+xml", 1024);

    // Act
    let response;

    await act(async () => {
      response = await result.current(file);
    });

    // Assert
    expect(mockUploadFile).not.toHaveBeenCalled();
    expect(response).toEqual({ success: 0, file: { url: "" } });
    expect(notifyMock).toHaveBeenCalledWith(expect.objectContaining({ status: "error" }));
  });

  it("rejects oversized files without calling the mutation", async () => {
    // Arrange
    const { result } = renderHook(() => useUploadRichTextImage());
    const file = makeFile("image/png", MAX_RICH_TEXT_IMAGE_SIZE_BYTES + 1);

    // Act
    let response;

    await act(async () => {
      response = await result.current(file);
    });

    // Assert
    expect(mockUploadFile).not.toHaveBeenCalled();
    expect(response).toEqual({ success: 0, file: { url: "" } });
    expect(notifyMock).toHaveBeenCalledWith(expect.objectContaining({ status: "error" }));
  });
});
