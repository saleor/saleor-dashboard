import { act, renderHook } from "@testing-library/react-hooks";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import useRouter from "use-react-router";

import { useUrlFilterStore } from "./useUrlFilterStore";

const createWrapper = (initialPath: string) => {
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: ReactNode }): JSX.Element => (
    <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
  );
};

describe("useUrlFilterStore", () => {
  describe("state parsing", () => {
    it("should return empty filterParams when URL has no filter keys", () => {
      // Arrange & Act
      const { result } = renderHook(() => useUrlFilterStore(), {
        wrapper: createWrapper("/products?action=assign&id=attr-1"),
      });

      // Assert
      expect(result.current.state.filterParams).toEqual({});
      expect(result.current.state.filterQueryString).toBe("");
    });

    it("should parse numeric keys as filter params", () => {
      // Arrange & Act
      const { result } = renderHook(() => useUrlFilterStore(), {
        wrapper: createWrapper("/products?0=filter1&1=AND&2=filter2"),
      });

      // Assert
      expect(result.current.state.filterParams).toEqual({
        "0": "filter1",
        "1": "AND",
        "2": "filter2",
      });
    });

    it("should preserve non-filter params separately", () => {
      // Arrange & Act
      const { result } = renderHook(() => useUrlFilterStore(), {
        wrapper: createWrapper("/products?action=assign&id=attr-1&0=filter1"),
      });

      // Assert
      expect(result.current.state.preservedParams).toEqual({
        action: "assign",
        id: "attr-1",
      });
      expect(result.current.state.filterParams).toEqual({
        "0": "filter1",
      });
    });

    it("should handle complex filter values with encoded characters", () => {
      // Arrange & Act
      const { result } = renderHook(() => useUrlFilterStore(), {
        wrapper: createWrapper("/products?0%5Bs0.category%5D=cat-1&action=assign"),
      });

      // Assert
      expect(result.current.state.filterParams).toEqual({
        "0": { "s0.category": "cat-1" },
      });
    });

    it("should generate correct filterQueryString", () => {
      // Arrange & Act
      const { result } = renderHook(() => useUrlFilterStore(), {
        wrapper: createWrapper("/products?0=filter1&1=AND&action=keep"),
      });

      // Assert
      expect(result.current.state.filterQueryString).toBe("0=filter1&1=AND");
    });

    it("should handle empty search string", () => {
      // Arrange & Act
      const { result } = renderHook(() => useUrlFilterStore(), {
        wrapper: createWrapper("/products"),
      });

      // Assert
      expect(result.current.state.search).toBe("");
      expect(result.current.state.filterParams).toEqual({});
      expect(result.current.state.preservedParams).toEqual({});
    });
  });

  describe("updateFilters", () => {
    it("should update URL with new filter params while preserving other params", () => {
      // Arrange
      const { result } = renderHook(
        () => {
          const store = useUrlFilterStore();
          const router = useRouter();

          return { store, router };
        },
        {
          wrapper: createWrapper("/products?action=assign&id=attr-1"),
        },
      );

      // Act
      act(() => {
        result.current.store.updateFilters({ "0": "newFilter", "1": "AND" });
      });

      // Assert
      expect(result.current.router.location.search).toContain("action=assign");
      expect(result.current.router.location.search).toContain("id=attr-1");
      expect(result.current.router.location.search).toContain("0=newFilter");
      expect(result.current.router.location.search).toContain("1=AND");
    });

    it("should replace existing filter params with new ones", () => {
      // Arrange
      const { result } = renderHook(
        () => {
          const store = useUrlFilterStore();
          const router = useRouter();

          return { store, router };
        },
        {
          wrapper: createWrapper("/products?0=oldFilter&action=assign"),
        },
      );

      // Act
      act(() => {
        result.current.store.updateFilters({ "0": "newFilter" });
      });

      // Assert
      expect(result.current.router.location.search).toContain("0=newFilter");
      expect(result.current.router.location.search).not.toContain("oldFilter");
    });

    it("should handle complex filter objects", () => {
      // Arrange
      const { result } = renderHook(
        () => {
          const store = useUrlFilterStore();
          const router = useRouter();

          return { store, router };
        },
        {
          wrapper: createWrapper("/products?action=assign"),
        },
      );

      // Act
      act(() => {
        result.current.store.updateFilters({
          "0": { "s0.category": "cat-1" },
        });
      });

      // Assert - the encoded form should be in the URL
      expect(result.current.router.location.search).toContain("0%5Bs0.category%5D=cat-1");
    });
  });

  describe("clearFilters", () => {
    it("should remove all filter params while preserving other params", () => {
      // Arrange
      const { result } = renderHook(
        () => {
          const store = useUrlFilterStore();
          const router = useRouter();

          return { store, router };
        },
        {
          wrapper: createWrapper("/products?0=filter1&1=AND&action=assign&id=attr-1"),
        },
      );

      // Act
      act(() => {
        result.current.store.clearFilters();
      });

      // Assert
      expect(result.current.router.location.search).toBe("?action=assign&id=attr-1");
    });

    it("should result in empty search when only filter params exist", () => {
      // Arrange
      const { result } = renderHook(
        () => {
          const store = useUrlFilterStore();
          const router = useRouter();

          return { store, router };
        },
        {
          wrapper: createWrapper("/products?0=filter1&1=AND"),
        },
      );

      // Act
      act(() => {
        result.current.store.clearFilters();
      });

      // Assert
      expect(result.current.router.location.search).toBe("");
    });
  });

  describe("reactivity", () => {
    it("should update state when URL changes", () => {
      // Arrange
      const { result } = renderHook(
        () => {
          const store = useUrlFilterStore();
          const router = useRouter();

          return { store, router };
        },
        {
          wrapper: createWrapper("/products?action=assign"),
        },
      );

      // Act - simulate navigation
      act(() => {
        result.current.router.history.push("/products?action=assign&0=newFilter");
      });

      // Assert
      expect(result.current.store.state.filterParams).toEqual({ "0": "newFilter" });
    });
  });
});
