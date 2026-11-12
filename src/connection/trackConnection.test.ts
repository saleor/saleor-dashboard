import { type ConnectionMonitor } from "./connectionMonitor";
import { trackConnection } from "./trackConnection";

type ReportingMonitor = Pick<ConnectionMonitor, "reportFailure" | "reportSuccess">;

const monitor: {
  [Method in keyof ReportingMonitor]: jest.MockedFunction<ReportingMonitor[Method]>;
} = {
  reportFailure: jest.fn(),
  reportSuccess: jest.fn(),
};

interface FakeResponse {
  status: number;
  headers: { get: (name: string) => string | null };
}

/** jsdom has no `Response`; the tracker only reads the status and headers. */
const answer = (status: number, headers: Record<string, string> = {}): FakeResponse => ({
  status,
  headers: { get: name => headers[name] ?? null },
});

describe("trackConnection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("passes a 503 through unchanged and reports it as Saleor not answering", async () => {
    // Arrange
    const proxyPage = answer(503, { "Retry-After": "20" });
    const tracked = trackConnection({ fetch: jest.fn().mockResolvedValue(proxyPage), monitor });

    // Act
    const result = await tracked("/graphql/", {});

    // Assert
    expect(result).toBe(proxyPage);
    expect(monitor.reportFailure).toHaveBeenCalledWith({ httpStatus: 503, retryAfterMs: 20_000 });
    expect(monitor.reportSuccess).not.toHaveBeenCalled();
  });

  it("reports any other answer, errors included, as Saleor answering", async () => {
    // Arrange
    const tracked = trackConnection({
      fetch: jest.fn().mockResolvedValueOnce(answer(200)).mockResolvedValueOnce(answer(500)),
      monitor,
    });

    // Act
    await tracked("/graphql/", {});
    await tracked("/graphql/", {});

    // Assert
    expect(monitor.reportSuccess).toHaveBeenCalledTimes(2);
    expect(monitor.reportFailure).not.toHaveBeenCalled();
  });

  it("reports a request with no response and rethrows the same error", async () => {
    // Arrange
    const offline = new TypeError("Failed to fetch");
    const tracked = trackConnection({ fetch: jest.fn().mockRejectedValue(offline), monitor });

    // Act
    const outcome = tracked("/graphql/", {});

    // Assert
    await expect(outcome).rejects.toBe(offline);
    expect(monitor.reportFailure).toHaveBeenCalledWith({ httpStatus: 0, retryAfterMs: null });
  });

  it("reports nothing for a cancelled request", async () => {
    // Arrange
    const cancelled = new DOMException("The operation was aborted", "AbortError");
    const tracked = trackConnection({ fetch: jest.fn().mockRejectedValue(cancelled), monitor });

    // Act
    const outcome = tracked("/graphql/", {});

    // Assert
    await expect(outcome).rejects.toBe(cancelled);
    expect(monitor.reportFailure).not.toHaveBeenCalled();
    expect(monitor.reportSuccess).not.toHaveBeenCalled();
  });
});
