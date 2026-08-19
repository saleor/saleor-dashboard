import { act, renderHook } from "@testing-library/react";

import { useEntityBackgroundImageUpload } from "./useEntityBackgroundImageUpload";

describe("useEntityBackgroundImageUpload", () => {
  const createObjectURL = jest.fn(() => "blob:preview");
  const revokeObjectURL = jest.fn();

  beforeEach(() => {
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: revokeObjectURL,
    });
  });

  it("keeps blob preview and bumps revision after a successful upload", async () => {
    // Arrange
    const { result } = renderHook(() => useEntityBackgroundImageUpload());
    const file = new File(["x"], "banner.png", { type: "image/png" });

    // Act
    let succeeded = false;

    await act(async () => {
      succeeded = await result.current.runImageMutation({
        file,
        mutate: async () => true,
      });
    });

    // Assert
    expect(succeeded).toBe(true);
    expect(result.current.backgroundImageUploadPreview).toBe("blob:preview");
    expect(result.current.isBackgroundImageUploading).toBe(false);
    expect(result.current.backgroundImageRevision).toBe(1);
    expect(revokeObjectURL).not.toHaveBeenCalled();
  });

  it("revokes blob preview when upload fails", async () => {
    // Arrange
    const { result } = renderHook(() => useEntityBackgroundImageUpload());
    const file = new File(["x"], "banner.png", { type: "image/png" });

    // Act
    await act(async () => {
      await result.current.runImageMutation({
        file,
        mutate: async () => false,
      });
    });

    // Assert
    expect(result.current.backgroundImageUploadPreview).toBeNull();
    expect(result.current.backgroundImageRevision).toBe(0);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:preview");
  });

  it("does not create a preview when deleting", async () => {
    // Arrange
    const { result } = renderHook(() => useEntityBackgroundImageUpload());

    // Act
    await act(async () => {
      await result.current.runImageMutation({
        file: null,
        mutate: async () => true,
      });
    });

    // Assert
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(result.current.backgroundImageRevision).toBe(0);
  });
});
