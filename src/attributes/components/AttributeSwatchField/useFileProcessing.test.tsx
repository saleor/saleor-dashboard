import { useFileUploadMutation } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react-hooks";

import { useFileProcessing } from "./useFileProcessing";

jest.mock("@dashboard/graphql", () => ({
  useFileUploadMutation: jest.fn(),
}));

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: (x: unknown) => x,
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
}));

jest.mock("@dashboard/intl", () => ({
  errorMessages: {
    imgageUploadErrorTitle: "Image upload error title",
    imageUploadErrorText: "Image upload error text",
  },
}));

jest.mock("@dashboard/hooks/useNotifier", () => () => jest.fn());

describe("useFileProcessing", () => {
  const mockUploadFile = jest.fn();
  const setMock = jest.fn();

  beforeEach(() => {
    (useFileUploadMutation as jest.Mock).mockReturnValue([mockUploadFile]);
    jest.clearAllMocks();
  });

  it("should handle file upload successfully", async () => {
    // Arrange
    const { result } = renderHook(() => useFileProcessing({ set: setMock }));
    const file = new File(["dummy content"], "example.png", { type: "image/png" });

    mockUploadFile.mockResolvedValueOnce({
      data: {
        fileUpload: {
          errors: [],
          uploadedFile: {
            url: "http://example.com/example.png",
            contentType: "image/png",
          },
        },
      },
    });

    // Act
    await act(() => result.current.handleFileUpload(file));
    await act(() => result.current.handleOnload());

    expect(mockUploadFile).toHaveBeenCalledWith({ variables: { file } });
    expect(setMock).toHaveBeenCalledWith({
      fileUrl: "http://example.com/example.png",
      contentType: "image/png",
      value: undefined,
    });
    expect(result.current.processing).toBe(false);
  });

  it("should handle file upload error", async () => {
    // Arrange
    const { result } = renderHook(() => useFileProcessing({ set: setMock }));
    const file = new File(["dummy content"], "example.png", { type: "image/png" });

    mockUploadFile.mockResolvedValueOnce({
      data: {
        fileUpload: {
          errors: [{ message: "Upload error" }],
        },
      },
    });

    // Act
    await act(() => result.current.handleFileUpload(file));
    await act(() => result.current.handleOnload());

    // Assert
    expect(mockUploadFile).toHaveBeenCalledWith({ variables: { file } });
    expect(setMock).not.toHaveBeenCalled();
    expect(result.current.processing).toBe(false);
  });

  it("should handle file deletion", () => {
    // Arrange
    const { result } = renderHook(() => useFileProcessing({ set: setMock }));

    // Act
    act(() => {
      result.current.handleFileDelete();
    });

    // Assert
    expect(setMock).toHaveBeenCalledWith({
      fileUrl: undefined,
      contentType: undefined,
      value: undefined,
    });
  });
});
