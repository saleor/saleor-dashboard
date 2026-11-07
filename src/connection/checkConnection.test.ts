import { CHECK_TIMEOUT_MS, checkConnection } from "./checkConnection";

interface FakeResponse {
  status: number;
  headers: { get: (name: string) => string | null };
}

const answer = (status: number, headers: Record<string, string> = {}): FakeResponse => ({
  status,
  headers: { get: name => headers[name] ?? null },
});

const mockFetch = jest.fn();

describe("checkConnection", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("asks the API for its type name, which needs no token", async () => {
    // Arrange
    mockFetch.mockResolvedValue(answer(200));

    // Act
    const result = await checkConnection("https://api.example.com/graphql/");

    // Assert
    expect(result).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/graphql/",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ query: "query ConnectionCheck { __typename }" }),
      }),
    );
  });

  it("counts an error answer as Saleor answering, but not a proxy's 503", async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce(answer(400)).mockResolvedValueOnce(answer(503));

    // Act
    const badRequest = await checkConnection("/graphql/");
    const proxyPage = await checkConnection("/graphql/");

    // Assert
    expect(badRequest).toEqual({ ok: true });
    expect(proxyPage).toEqual({ ok: false, failure: { httpStatus: 503, retryAfterMs: null } });
  });

  it("fails when the request gets no response", async () => {
    // Arrange
    mockFetch.mockRejectedValue(new TypeError("Failed to fetch"));

    // Act
    const result = await checkConnection("/graphql/");

    // Assert
    expect(result).toEqual({ ok: false, failure: { httpStatus: 0, retryAfterMs: null } });
  });

  it("gives up on a check that gets no answer in time", async () => {
    // Arrange
    jest.useFakeTimers();
    mockFetch.mockImplementation(
      (_url: string, { signal }: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
        }),
    );

    // Act
    const pending = checkConnection("/graphql/");

    jest.advanceTimersByTime(CHECK_TIMEOUT_MS);

    // Assert
    await expect(pending).resolves.toEqual({
      ok: false,
      failure: { httpStatus: 0, retryAfterMs: null },
    });
  });
});
