import { act, renderHook } from "@testing-library/react-hooks";

import { useQuickOrderSearch } from "./useQuickOrderSearch";

const useSearchOrdersByNumberQuery = jest.fn();

jest.mock("@dashboard/graphql", () => ({
  SearchOrdersByNumberQuery: {},
  useSearchOrdersByNumberQuery: (props: any) => useSearchOrdersByNumberQuery(props),
}));
jest.mock("@dashboard/hooks/useDebounce", () => (fn: any) => fn);

describe("useQuickOrderSearch", () => {
  it("invokes search query", () => {
    // Arrange
    const { result } = renderHook(() => useQuickOrderSearch());

    // Act
    act(() => result.current[1]("1234"));

    // Assert
    expect(useSearchOrdersByNumberQuery).toHaveBeenCalledWith({
      skip: false,
      variables: {
        first: 1,
        query: "1234",
      },
    });
  });
});
