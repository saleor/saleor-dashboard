import { ApolloClient, InMemoryCache } from "@apollo/client";
import { renderHook } from "@testing-library/react-hooks";

import { useBackgroundTasks } from "./BackgroundTasksProvider";
import { Task, TaskStatus } from "./types";

describe("BackgroundTasksProvider runtime checks", () => {
  const mockClient = new ApolloClient({
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
      },
    },
  });
  const mockNotify = jest.fn();
  const mockIntl = {
    formatMessage: jest.fn(msg => msg.defaultMessage || ""),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("queue function", () => {
    it("should throw error when CUSTOM task is queued without data", () => {
      // Arrange
      const { result } = renderHook(() => useBackgroundTasks(mockClient, mockNotify, mockIntl));

      // Act & Assert
      expect(() => result.current.queue(Task.CUSTOM)).toThrow("data is required for CUSTOM task");
    });

    it("should throw error when INVOICE_GENERATE task is queued without data", () => {
      // Arrange
      const { result } = renderHook(() => useBackgroundTasks(mockClient, mockNotify, mockIntl));

      // Act & Assert
      expect(() => result.current.queue(Task.INVOICE_GENERATE)).toThrow(
        "data.generateInvoice is required for INVOICE_GENERATE task",
      );
    });

    it("should throw error when INVOICE_GENERATE task is queued without generateInvoice", () => {
      // Arrange
      const { result } = renderHook(() => useBackgroundTasks(mockClient, mockNotify, mockIntl));

      // Act & Assert
      expect(() => result.current.queue(Task.INVOICE_GENERATE, { id: "test" })).toThrow(
        "data.generateInvoice is required for INVOICE_GENERATE task",
      );
    });

    it("should throw error when EXPORT task is queued without data", () => {
      // Arrange
      const { result } = renderHook(() => useBackgroundTasks(mockClient, mockNotify, mockIntl));

      // Act & Assert
      expect(() => result.current.queue(Task.EXPORT)).toThrow(
        "data.id is required for EXPORT task",
      );
    });

    it("should throw error when EXPORT task is queued without id", () => {
      // Arrange
      const { result } = renderHook(() => useBackgroundTasks(mockClient, mockNotify, mockIntl));

      // Act & Assert
      expect(() =>
        result.current.queue(Task.EXPORT, { generateInvoice: { orderId: "1", invoiceId: "2" } }),
      ).toThrow("data.id is required for EXPORT task");
    });

    it("should successfully queue CUSTOM task with valid data", () => {
      // Arrange
      const { result } = renderHook(() => useBackgroundTasks(mockClient, mockNotify, mockIntl));
      const taskData = {
        handle: jest.fn(() => Promise.resolve(TaskStatus.SUCCESS)),
        onCompleted: jest.fn(),
      };

      // Act
      const taskId = result.current.queue(Task.CUSTOM, taskData);

      // Assert
      expect(taskId).toBe(1);
      expect(() => result.current.queue(Task.CUSTOM, taskData)).not.toThrow();
    });

    it("should successfully queue INVOICE_GENERATE task with valid data", () => {
      // Arrange
      const { result } = renderHook(() => useBackgroundTasks(mockClient, mockNotify, mockIntl));
      const taskData = {
        generateInvoice: {
          orderId: "order-123",
          invoiceId: "invoice-456",
        },
      };

      // Act & Assert
      expect(() => result.current.queue(Task.INVOICE_GENERATE, taskData)).not.toThrow();
    });

    it("should successfully queue EXPORT task with valid data", () => {
      // Arrange
      const { result } = renderHook(() => useBackgroundTasks(mockClient, mockNotify, mockIntl));
      const taskData = {
        id: "export-123",
      };

      // Act & Assert
      expect(() => result.current.queue(Task.EXPORT, taskData)).not.toThrow();
    });
  });
});
