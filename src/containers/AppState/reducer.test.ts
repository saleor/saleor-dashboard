import reduceAppState, { AppStateReducerAction } from "./reducer";
import IAppState, { initialAppState } from "./state";

describe("reduceAppState", () => {
  describe("displayError action", () => {
    // Arrange
    const prevState: IAppState = initialAppState;

    it("should display error when error type is provided", () => {
      // Arrange
      const action: AppStateReducerAction = {
        type: "displayError",
        payload: {
          error: "unhandled",
          errorId: "test-error-id",
        },
      };

      // Act
      const result = reduceAppState(prevState, action);

      // Assert
      expect(result).toEqual({
        error: {
          type: "unhandled",
          id: "test-error-id",
        },
        loading: false,
      });
    });

    it("should display error without errorId", () => {
      // Arrange
      const action: AppStateReducerAction = {
        type: "displayError",
        payload: {
          error: "unhandled",
        },
      };

      // Act
      const result = reduceAppState(prevState, action);

      // Assert
      expect(result).toEqual({
        error: {
          type: "unhandled",
          id: undefined,
        },
        loading: false,
      });
    });

    it("should throw error when error type is undefined", () => {
      // Arrange
      const action: AppStateReducerAction = {
        type: "displayError",
        payload: {},
      };

      // Act & Assert
      expect(() => reduceAppState(prevState, action)).toThrow(
        "error is required when displaying error",
      );
    });
  });

  describe("displayLoader action", () => {
    // Arrange
    const prevState: IAppState = initialAppState;

    it("should set loading to true", () => {
      // Arrange
      const action: AppStateReducerAction = {
        type: "displayLoader",
        payload: {
          value: true,
        },
      };

      // Act
      const result = reduceAppState(prevState, action);

      // Assert
      expect(result).toEqual({
        ...prevState,
        loading: true,
      });
    });

    it("should set loading to false", () => {
      // Arrange
      const action: AppStateReducerAction = {
        type: "displayLoader",
        payload: {
          value: false,
        },
      };

      // Act
      const result = reduceAppState(prevState, action);

      // Assert
      expect(result).toEqual({
        ...prevState,
        loading: false,
      });
    });

    it("should throw error when value is undefined", () => {
      // Arrange
      const action: AppStateReducerAction = {
        type: "displayLoader",
        payload: {},
      };

      // Act & Assert
      expect(() => reduceAppState(prevState, action)).toThrow(
        "value is required when displaying loader",
      );
    });
  });

  describe("default case", () => {
    it("should return previous state for unknown action type", () => {
      // Arrange
      const prevState: IAppState = initialAppState;
      const action = {
        type: "unknown" as any,
        payload: {},
      };

      // Act
      const result = reduceAppState(prevState, action);

      // Assert
      expect(result).toBe(prevState);
    });
  });
});
