import { JobStatusEnum } from "@dashboard/graphql";

import { queueInvoiceGenerate } from "./tasks";
import { QueuedTask, TaskStatus } from "./types";

describe("queueInvoiceGenerate", () => {
  it("should throw error when invoice is not found", async () => {
    // Arrange
    const tasks = { current: [] as QueuedTask[] };
    const generateInvoice = {
      orderId: "order-123",
      invoiceId: "invoice-456",
    };
    const fetch = jest.fn().mockResolvedValue({
      data: {
        order: {
          invoices: [
            {
              id: "other-invoice",
              status: JobStatusEnum.SUCCESS,
            },
          ],
        },
      },
    });
    const notify = jest.fn();
    const intl = {
      formatMessage: jest.fn(msg => msg.defaultMessage),
    } as any;

    // Act
    queueInvoiceGenerate(1, generateInvoice, tasks, fetch, notify, intl);

    // Assert
    expect(tasks.current).toHaveLength(1);

    // Try to execute the handle function
    const task = tasks.current[0];

    await expect(task.handle()).rejects.toThrow("Invoice with id invoice-456 not found");
  });

  it("should throw error when order is not found", async () => {
    // Arrange
    const tasks = { current: [] as QueuedTask[] };
    const generateInvoice = {
      orderId: "order-123",
      invoiceId: "invoice-456",
    };
    const fetch = jest.fn().mockResolvedValue({
      data: {
        order: null,
      },
    });
    const notify = jest.fn();
    const intl = {
      formatMessage: jest.fn(msg => msg.defaultMessage),
    } as any;

    // Act
    queueInvoiceGenerate(1, generateInvoice, tasks, fetch, notify, intl);

    // Assert
    expect(tasks.current).toHaveLength(1);

    // Try to execute the handle function
    const task = tasks.current[0];

    await expect(task.handle()).rejects.toThrow("Order not found");
  });

  it("should successfully find invoice and return status", async () => {
    // Arrange
    const tasks = { current: [] as QueuedTask[] };
    const generateInvoice = {
      orderId: "order-123",
      invoiceId: "invoice-456",
    };
    const fetch = jest.fn().mockResolvedValue({
      data: {
        order: {
          invoices: [
            {
              id: "invoice-456",
              status: JobStatusEnum.SUCCESS,
            },
          ],
        },
      },
    });
    const notify = jest.fn();
    const intl = {
      formatMessage: jest.fn(msg => msg.defaultMessage),
    } as any;

    // Act
    queueInvoiceGenerate(1, generateInvoice, tasks, fetch, notify, intl);

    // Assert
    expect(tasks.current).toHaveLength(1);

    // Try to execute the handle function
    const task = tasks.current[0];
    const result = await task.handle();

    expect(result).toBe(TaskStatus.SUCCESS);
  });
});
