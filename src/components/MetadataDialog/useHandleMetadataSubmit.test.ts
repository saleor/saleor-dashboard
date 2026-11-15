import { type DocumentNode, useApolloClient } from "@apollo/client";
import { type MetadataFormData } from "@dashboard/components/Metadata/types";
import {
  OrderDetailsDocument,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import { renderHook } from "@testing-library/react";
import { act } from "react";

import { useHandleMetadataSubmit } from "./useHandleMetadataSubmit";

// Mocks
const mockNotify = jest.fn();

jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: () => mockNotify,
}));

jest.mock("@apollo/client", () => ({
  ...(jest.requireActual("@apollo/client") as {}),
  useApolloClient: jest.fn(),
}));

jest.mock("@dashboard/graphql", () => ({
  ...(jest.requireActual("@dashboard/graphql") as {}),
  useUpdateMetadataMutation: jest.fn(),
  useUpdatePrivateMetadataMutation: jest.fn(),
}));

// Test fixtures
const mockInitialData = {
  id: "test-id",
  metadata: [{ key: "existing-key", value: "existing-value" }],
  privateMetadata: [{ key: "private-key", value: "private-value" }],
};

// What the form was loaded with.
const mockBaseline: MetadataFormData = {
  metadata: [{ key: "existing-key", value: "existing-value" }],
  privateMetadata: [{ key: "private-key", value: "private-value" }],
};

const mockMetadataFormData: MetadataFormData = {
  metadata: [{ key: "new-key", value: "new-value" }],
  privateMetadata: [{ key: "new-private-key", value: "new-private-value" }],
};

const mockDocument: DocumentNode = OrderDetailsDocument;

describe("useHandleMetadataSubmit", () => {
  let mockUpdateMetadata: jest.Mock;
  let mockUpdatePrivateMetadata: jest.Mock;
  let mockClient: {
    refetchQueries: jest.Mock;
  };
  let mockOnClose: jest.Mock;

  beforeEach(() => {
    // Arrange
    jest.clearAllMocks();

    mockUpdateMetadata = jest.fn().mockResolvedValue({
      data: { updateMetadata: { errors: [] } },
    });

    mockUpdatePrivateMetadata = jest.fn().mockResolvedValue({
      data: { updatePrivateMetadata: { errors: [] } },
    });

    mockClient = {
      refetchQueries: jest.fn(() => Promise.resolve([])),
    };

    mockOnClose = jest.fn();

    (useUpdateMetadataMutation as jest.Mock).mockReturnValue([
      mockUpdateMetadata,
      { loading: false },
    ]);

    (useUpdatePrivateMetadataMutation as jest.Mock).mockReturnValue([
      mockUpdatePrivateMetadata,
      { loading: false },
    ]);

    (useApolloClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("should return onSubmit and submitInProgress", () => {
    // Arrange
    // Act
    const { result } = renderHook(() =>
      useHandleMetadataSubmit({
        initialData: mockInitialData,
        onClose: mockOnClose,
        refetchDocument: mockDocument,
      }),
    );

    // Assert
    expect(result.current).toHaveProperty("onSubmit");
    expect(result.current).toHaveProperty("submitInProgress");
    expect(typeof result.current.onSubmit).toBe("function");
  });

  it("doesn't report a save or close when no metadata was loaded", async () => {
    // Arrange
    const { result } = renderHook(() =>
      useHandleMetadataSubmit({
        initialData: undefined,
        onClose: mockOnClose,
        refetchDocument: mockDocument,
      }),
    );

    // Act
    await act(async () => {
      await result.current.onSubmit(mockMetadataFormData, mockBaseline);
    });

    // Assert
    expect(mockUpdateMetadata).not.toHaveBeenCalled();
    expect(mockUpdatePrivateMetadata).not.toHaveBeenCalled();
    expect(mockNotify).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("should show success notification and close on successful submission", async () => {
    // Arrange
    const { result } = renderHook(() =>
      useHandleMetadataSubmit({
        initialData: mockInitialData,
        onClose: mockOnClose,
        refetchDocument: mockDocument,
      }),
    );

    // Act
    await act(async () => {
      await result.current.onSubmit(mockMetadataFormData, mockBaseline);
    });

    // Assert
    expect(mockNotify).toHaveBeenCalledWith({
      status: "success",
      text: expect.any(String),
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("confirms the save and closes even when reloading the metadata afterwards fails", async () => {
    // Arrange
    mockClient.refetchQueries.mockReturnValue(Promise.reject(new Error("Failed to fetch")));

    const { result } = renderHook(() =>
      useHandleMetadataSubmit({
        initialData: mockInitialData,
        onClose: mockOnClose,
        refetchDocument: mockDocument,
      }),
    );

    // Act
    await act(async () => {
      await result.current.onSubmit(mockMetadataFormData, mockBaseline);
    });

    // Assert
    expect(mockUpdateMetadata).toHaveBeenCalled();
    expect(mockNotify).toHaveBeenCalledWith({ status: "success", text: expect.any(String) });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should not close or show success when mutation returns errors", async () => {
    // Arrange
    mockUpdateMetadata.mockResolvedValue({
      data: { updateMetadata: { errors: [{ message: "Error" }] } },
    });

    const { result } = renderHook(() =>
      useHandleMetadataSubmit({
        initialData: mockInitialData,
        onClose: mockOnClose,
        refetchDocument: mockDocument,
      }),
    );

    // Act
    await act(async () => {
      await result.current.onSubmit(mockMetadataFormData, mockBaseline);
    });

    // Assert
    expect(mockClient.refetchQueries).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockNotify).not.toHaveBeenCalledWith(expect.objectContaining({ status: "success" }));
  });

  it("stays in progress and open until the reload after saving has finished", async () => {
    // Arrange
    let finishReload: (value: unknown[]) => void = () => undefined;

    mockClient.refetchQueries.mockReturnValue(
      new Promise<unknown[]>(resolve => {
        finishReload = resolve;
      }),
    );

    const { result } = renderHook(() =>
      useHandleMetadataSubmit({
        initialData: mockInitialData,
        onClose: mockOnClose,
        refetchDocument: mockDocument,
      }),
    );

    // Act
    let saving: Promise<void> = Promise.resolve();

    await act(async () => {
      saving = result.current.onSubmit(mockMetadataFormData, mockBaseline);
    });

    // Assert
    expect(mockClient.refetchQueries).toHaveBeenCalledTimes(1);
    expect(mockClient.refetchQueries).toHaveBeenCalledWith({ include: [mockDocument] });
    expect(result.current.submitInProgress).toBe(true);
    expect(mockOnClose).not.toHaveBeenCalled();

    await act(async () => {
      finishReload([]);
      await saving;
    });

    expect(result.current.submitInProgress).toBe(false);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("sends only what differs from what the form was loaded with", async () => {
    // Arrange
    // The server already has a newer value for "existing-key" than the form was loaded with.
    const newerOnServer = {
      ...mockInitialData,
      metadata: [{ key: "existing-key", value: "changed-by-an-app" }],
    };
    const { result } = renderHook(() =>
      useHandleMetadataSubmit({
        initialData: newerOnServer,
        onClose: mockOnClose,
        refetchDocument: mockDocument,
      }),
    );
    const edited: MetadataFormData = {
      metadata: [...mockBaseline.metadata, { key: "added-key", value: "added-value" }],
      privateMetadata: mockBaseline.privateMetadata,
    };

    // Act
    await act(async () => {
      await result.current.onSubmit(edited, mockBaseline);
    });

    // Assert
    expect(mockUpdateMetadata).toHaveBeenCalledWith({
      variables: {
        id: mockInitialData.id,
        input: [{ key: "added-key", value: "added-value" }],
        keysToDelete: [],
      },
    });
    expect(mockUpdatePrivateMetadata).not.toHaveBeenCalled();
  });

  it("should reflect loading state during mutation", () => {
    // Arrange
    (useUpdateMetadataMutation as jest.Mock).mockReturnValue([
      mockUpdateMetadata,
      { loading: true },
    ]);

    // Act
    const { result } = renderHook(() =>
      useHandleMetadataSubmit({
        initialData: mockInitialData,
        onClose: mockOnClose,
        refetchDocument: mockDocument,
      }),
    );

    // Assert
    expect(result.current.submitInProgress).toBe(true);
  });

  it("should reflect loading state from privateMetadata mutation", () => {
    // Arrange
    (useUpdatePrivateMetadataMutation as jest.Mock).mockReturnValue([
      mockUpdatePrivateMetadata,
      { loading: true },
    ]);

    // Act
    const { result } = renderHook(() =>
      useHandleMetadataSubmit({
        initialData: mockInitialData,
        onClose: mockOnClose,
        refetchDocument: mockDocument,
      }),
    );

    // Assert
    expect(result.current.submitInProgress).toBe(true);
  });
});
