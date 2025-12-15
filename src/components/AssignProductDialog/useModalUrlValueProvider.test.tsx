import { act, renderHook } from "@testing-library/react-hooks";
import useRouter from "use-react-router";

import { InitialProductStateResponse } from "../ConditionalFilter/API/initialState/product/InitialProductStateResponse";
import { InitialProductAPIState } from "../ConditionalFilter/API/initialState/product/useProductInitialAPIState";
import { useModalUrlValueProvider } from "./useModalUrlValueProvider";

jest.mock("use-react-router", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("useModalUrlValueProvider", () => {
  it("does not refetch when initialState.fetchQueries identity changes to avoid infinite re-render", () => {
    // Arrange
    const fetchQueriesFirst = jest.fn().mockResolvedValue(undefined);
    const fetchQueriesSecond = jest.fn().mockResolvedValue(undefined);

    const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

    mockedUseRouter.mockReturnValue({
      location: {
        pathname: "/",
        search: "?action=assign&id=1",
      },
      history: {
        replace: jest.fn(),
      },
      // mock only needed properties
    } as unknown as ReturnType<typeof useRouter>);

    const initialStateFirst: InitialProductAPIState = {
      data: InitialProductStateResponse.empty(),
      loading: true,
      fetchQueries: fetchQueriesFirst,
    };

    // Same data different reference
    const initialStateSecond: InitialProductAPIState = {
      data: InitialProductStateResponse.empty(),
      loading: true,
      fetchQueries: fetchQueriesSecond,
    };

    // Act
    const hook = renderHook(({ initialState }) => useModalUrlValueProvider(initialState), {
      initialProps: {
        initialState: initialStateFirst,
      },
    });

    act(() => {
      hook.rerender({
        initialState: initialStateSecond,
      });
    });

    // Assert
    expect(fetchQueriesFirst).toHaveBeenCalledTimes(1);
    expect(fetchQueriesSecond).toHaveBeenCalledTimes(0);
  });
});
