import { useVoucherCodesQuery } from "@dashboard/graphql";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { useVoucherCodes } from "./useVoucherCodes";

jest.mock("uuid", () => ({ v4: () => "123456789" }));
jest.mock("@dashboard/graphql", () => ({
  useVoucherCodesQuery: jest.fn(() => ({
    data: {
      voucher: {
        codes: {
          edges: [
            {
              node: {
                code: "code 1",
                used: 0,
              },
            },
            {
              node: {
                code: "code 2",
                used: 0,
              },
            },
          ],
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
            endCursor: "curson",
            startCursor: "cursor",
          },
        },
      },
    },
    loading: false,
    refetch: jest.fn(),
  })),
}));

describe("useVoucherCodes", () => {
  it("should return correct data", () => {
    const { result } = renderHook(() => useVoucherCodes({ id: "1" }));

    expect(result.current).toMatchSnapshot();
  });

  it("should return manually generated voucher coded", () => {
    const { result } = renderHook(() => useVoucherCodes({ id: "1" }));

    act(() => {
      result.current.handleAddVoucherCode("code 3");
      result.current.handleAddVoucherCode("code 4");
    });

    expect(result.current.voucherCodes).toEqual([
      { code: "code 3", status: "Draft" },
      { code: "code 4", status: "Draft" },
      { code: "code 1", used: 0 },
      { code: "code 2", used: 0 },
    ]);
  });

  it("should return automatictlly genereted voucher codes", () => {
    const { result } = renderHook(() => useVoucherCodes({ id: "1" }));

    act(() => {
      result.current.handleGenerateMultipeCodes({
        quantity: "5",
        prefix: "code",
      });
    });

    expect(result.current.voucherCodes).toEqual([
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
      { code: "code 1", used: 0 },
      { code: "code 2", used: 0 },
    ]);
  });

  it("should allow to paginate voucher codes comes from server", () => {
    const { result } = renderHook(() => useVoucherCodes({ id: "1" }));

    act(() => {
      result.current.updateVoucherCodesListSettings("rowNumber", 2);
    });

    expect(result.current.voucherCodesPagination.pageInfo.hasPreviousPage).toBe(
      false,
    );
    expect(result.current.voucherCodesPagination.pageInfo.hasNextPage).toBe(
      true,
    );

    expect(result.current.voucherCodes).toEqual([
      { code: "code 1", used: 0 },
      { code: "code 2", used: 0 },
    ]);

    (useVoucherCodesQuery as jest.Mock).mockImplementation(() => ({
      data: {
        voucher: {
          codes: {
            edges: [
              {
                node: {
                  code: "code 3",
                  used: 0,
                },
              },
              {
                node: {
                  code: "code 4",
                  used: 0,
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: true,
              endCursor: "curson",
              startCursor: "cursor",
            },
          },
        },
      },
      loading: false,
    }));

    act(() => {
      result.current.voucherCodesPagination.loadNextPage();
    });

    expect(result.current.voucherCodes).toEqual([
      { code: "code 3", used: 0 },
      { code: "code 4", used: 0 },
    ]);

    expect(result.current.voucherCodesPagination.pageInfo.hasNextPage).toBe(
      false,
    );

    expect(result.current.voucherCodesPagination.pageInfo.hasPreviousPage).toBe(
      true,
    );

    (useVoucherCodesQuery as jest.Mock).mockImplementation(() => ({
      data: {
        voucher: {
          codes: {
            edges: [
              {
                node: {
                  code: "code 1",
                  used: 0,
                },
              },
              {
                node: {
                  code: "code 2",
                  used: 0,
                },
              },
            ],
            pageInfo: {
              hasNextPage: true,
              hasPreviousPage: false,
              endCursor: "curson",
              startCursor: "cursor",
            },
          },
        },
      },
      loading: false,
    }));

    act(() => {
      result.current.voucherCodesPagination.loadPreviousPage();
    });

    expect(result.current.voucherCodesPagination.pageInfo.hasNextPage).toBe(
      true,
    );
    expect(result.current.voucherCodes).toEqual([
      { code: "code 1", used: 0 },
      { code: "code 2", used: 0 },
    ]);
  });

  it("should allow to paginate voucher codes comes from client", () => {
    (useVoucherCodesQuery as jest.Mock).mockImplementation(() => ({
      data: null,
      loading: false,
    }));

    const generatedCodes = [
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
    ];

    const { result } = renderHook(() => useVoucherCodes({ id: "1" }));

    act(() => {
      result.current.updateVoucherCodesListSettings("rowNumber", 5);
      result.current.handleGenerateMultipeCodes({
        quantity: "10",
        prefix: "code",
      });
      result.current.handleAddVoucherCode("code 1");
      result.current.handleAddVoucherCode("code 2");
    });

    expect(result.current.voucherCodes).toEqual(generatedCodes.slice(5));

    act(() => {
      result.current.voucherCodesPagination.loadNextPage();
    });

    expect(result.current.voucherCodesPagination.pageInfo.hasNextPage).toBe(
      true,
    );
    expect(result.current.voucherCodesPagination.pageInfo.hasPreviousPage).toBe(
      true,
    );
    expect(result.current.voucherCodes).toEqual(generatedCodes.slice(5));

    act(() => {
      result.current.voucherCodesPagination.loadNextPage();
    });

    expect(result.current.voucherCodesPagination.pageInfo.hasNextPage).toBe(
      undefined,
    );
    expect(result.current.voucherCodesPagination.pageInfo.hasPreviousPage).toBe(
      true,
    );
    expect(result.current.voucherCodes).toEqual([
      { code: "code 1", status: "Draft" },
      { code: "code 2", status: "Draft" },
    ]);

    act(() => {
      result.current.voucherCodesPagination.loadPreviousPage();
    });
    act(() => {
      result.current.voucherCodesPagination.loadPreviousPage();
    });

    expect(result.current.voucherCodesPagination.pageInfo.hasNextPage).toBe(
      true,
    );
    expect(result.current.voucherCodesPagination.pageInfo.hasPreviousPage).toBe(
      false,
    );
    expect(result.current.voucherCodes).toEqual(generatedCodes.slice(5));

    act(() => {
      result.current.voucherCodesPagination.loadNextPage();
      result.current.updateVoucherCodesListSettings("rowNumber", 20);
    });

    expect(result.current.voucherCodesPagination.pageInfo.hasNextPage).toBe(
      undefined,
    );
    expect(result.current.voucherCodesPagination.pageInfo.hasPreviousPage).toBe(
      false,
    );
    expect(result.current.voucherCodes).toEqual([
      ...generatedCodes,
      { code: "code 1", status: "Draft" },
      { code: "code 2", status: "Draft" },
    ]);
  });

  it("should allow to paginate voucher codes comes from client and server", () => {
    (useVoucherCodesQuery as jest.Mock).mockImplementation(() => ({
      data: {
        voucher: {
          codes: {
            edges: [
              {
                node: {
                  code: "code 1",
                  used: 0,
                },
              },
              {
                node: {
                  code: "code 2",
                  used: 0,
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: true,
              endCursor: "curson",
              startCursor: "cursor",
            },
          },
        },
      },
      loading: false,
    }));

    const { result } = renderHook(() => useVoucherCodes({ id: "1" }));

    const generatedCodes = [
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
      { code: "code-123456789", status: "Draft" },
    ];

    act(() => {
      result.current.updateVoucherCodesListSettings("rowNumber", 2);
      result.current.handleGenerateMultipeCodes({
        quantity: "3",
        prefix: "code",
      });
    });

    expect(result.current.voucherCodesPagination.pageInfo.hasNextPage).toBe(
      true,
    );
    expect(result.current.voucherCodesPagination.pageInfo.hasPreviousPage).toBe(
      false,
    );
    expect(result.current.voucherCodes).toEqual(generatedCodes.slice(1));

    (useVoucherCodesQuery as jest.Mock).mockImplementation(() => ({
      data: {
        voucher: {
          codes: {
            edges: [
              {
                node: {
                  code: "code 1",
                  used: 0,
                },
              },
            ],
            pageInfo: {
              hasNextPage: true,
              hasPreviousPage: false,
              endCursor: "cursor",
              startCursor: "cursor",
            },
          },
        },
      },
      loading: false,
    }));

    act(() => {
      result.current.voucherCodesPagination.loadNextPage();
    });

    expect(useVoucherCodesQuery).toHaveBeenCalledWith({
      skip: false,
      variables: { first: 1, id: "1" },
    });
    expect(result.current.voucherCodesPagination.pageInfo.hasNextPage).toBe(
      true,
    );
    expect(result.current.voucherCodesPagination.pageInfo.hasPreviousPage).toBe(
      true,
    );
    expect(result.current.voucherCodes).toEqual([
      ...generatedCodes.slice(2),
      { code: "code 1", used: 0 },
    ]);

    (useVoucherCodesQuery as jest.Mock).mockImplementation(() => ({
      data: {
        voucher: {
          codes: {
            edges: [
              {
                node: {
                  code: "code 2",
                  used: 0,
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: true,
              endCursor: "cursor",
              startCursor: "cursor",
            },
          },
        },
      },
      loading: false,
    }));

    act(() => {
      result.current.voucherCodesPagination.loadNextPage();
    });

    expect(result.current.voucherCodesPagination.pageInfo.hasNextPage).toBe(
      false,
    );
    expect(result.current.voucherCodesPagination.pageInfo.hasPreviousPage).toBe(
      true,
    );
    expect(result.current.voucherCodes).toEqual([{ code: "code 2", used: 0 }]);

    (useVoucherCodesQuery as jest.Mock).mockImplementation(() => ({
      data: {
        voucher: {
          codes: {
            edges: [
              {
                node: {
                  code: "code 1",
                  used: 0,
                },
              },
            ],
            pageInfo: {
              hasNextPage: true,
              hasPreviousPage: false,
              endCursor: "cursor",
              startCursor: "cursor",
            },
          },
        },
      },
      loading: false,
    }));

    act(() => {
      result.current.voucherCodesPagination.loadPreviousPage();
    });

    expect(result.current.voucherCodesPagination.pageInfo.hasNextPage).toBe(
      true,
    );
    expect(result.current.voucherCodesPagination.pageInfo.hasPreviousPage).toBe(
      true,
    );

    expect(result.current.voucherCodes).toEqual([
      ...generatedCodes.slice(2),
      { code: "code 1", used: 0 },
    ]);

    act(() => {
      result.current.voucherCodesPagination.loadPreviousPage();
    });

    expect(result.current.voucherCodesPagination.pageInfo.hasNextPage).toBe(
      true,
    );
    expect(result.current.voucherCodesPagination.pageInfo.hasPreviousPage).toBe(
      false,
    );
    expect(result.current.voucherCodes).toEqual(generatedCodes.slice(1));
  });
});
