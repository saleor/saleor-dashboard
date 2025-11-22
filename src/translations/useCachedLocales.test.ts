import { LanguageCodeEnum } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react-hooks";
import { useState } from "react";

import { CachedLocalesStack, useCachedLocales } from "./useCachedLocales";

jest.mock("@dashboard/hooks/useLocalStorage", () => ({
  __esModule: true,
  default: jest.fn(() => {
    const [value, setValue] = useState([]);

    return [value, setValue];
  }),
}));

describe("CachedLocalesStack", () => {
  let stack: CachedLocalesStack;

  beforeEach(() => {
    // Arrange
    stack = new CachedLocalesStack([]);
  });

  describe("getMembers", () => {
    it("should return empty array when no members are added", () => {
      // Arrange
      // Act
      const members = stack.getMembers();

      // Assert
      expect(members).toEqual([]);
    });

    it("should return members in right order", () => {
      // Arrange
      stack.appendMember("EN");
      stack.appendMember("PL");
      stack.appendMember("DE");

      // Act
      const members = stack.getMembers();

      // Assert
      expect(members).toEqual(["EN", "PL", "DE"]);
    });
  });

  describe("appendMember", () => {
    it("should add new member to the stack", () => {
      // Arrange
      // Act
      stack.appendMember("EN");

      // Assert
      expect(stack.getMembers()).toContain("EN");
    });

    it("should not add duplicate members", () => {
      // Arrange
      stack.appendMember("EN");

      // Act
      stack.appendMember("EN");

      // Assert
      expect(stack.getMembers()).toEqual(["EN"]);
    });

    it("should remove oldest member when exceeding max capacity", () => {
      // Arrange
      const languages = [
        "EN",
        "PL",
        "DE",
        "FR",
        "ES",
        "IT",
        "RU",
        "JA",
        "KO",
        "ZH",
      ];

      expect(languages.length).toBe(10);

      languages.forEach(lang => stack.appendMember(lang));

      // Act
      stack.appendMember("AR");

      // Assert
      const members = stack.getMembers();

      expect(members).not.toContain("EN");
      expect(members).toContain("AR");
      expect(members.length).toBe(10);
    });

    it("should return the updated members set", () => {
      // Arrange
      // Act
      const result = stack.appendMember("EN");

      // Assert
      expect(result).toBeInstanceOf(Set);
      expect(result.has("EN")).toBe(true);
    });
  });
});

describe("useCachedLocales", () => {
  beforeEach(() => {
    // Arrange
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should return empty array as initial cached values", () => {
    // Arrange
    // Act
    const { result } = renderHook(() => useCachedLocales());

    // Assert
    expect(result.current.cachedValues).toEqual([]);
  });

  it("should provide pushValue function", () => {
    // Arrange
    // Act
    const { result } = renderHook(() => useCachedLocales());

    // Assert
    expect(typeof result.current.pushValue).toBe("function");
  });

  it("should update cached values when pushValue is called", () => {
    // Arrange
    const { result } = renderHook(() => useCachedLocales());

    // Act
    act(() => {
      result.current.pushValue("EN");
    });

    // Assert
    expect(result.current.cachedValues).toContain("EN");
  });

  it("Values are reversed", () => {
    // Arrange
    const { result } = renderHook(() => useCachedLocales());

    const languages = [
      "EN",
      "PL",
      "DE",
      "FR",
      "ES",
    ];

    // Act
    act(() => {
      languages.forEach(lang => result.current.pushValue(lang));
    });

    // Assert
    expect(result.current.cachedValues).toEqual([...languages].reverse());
  });
});
