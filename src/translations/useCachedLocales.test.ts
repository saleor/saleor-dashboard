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
      stack.appendMember(LanguageCodeEnum.EN);
      stack.appendMember(LanguageCodeEnum.PL);
      stack.appendMember(LanguageCodeEnum.DE);

      // Act
      const members = stack.getMembers();

      // Assert
      expect(members).toEqual([LanguageCodeEnum.EN, LanguageCodeEnum.PL, LanguageCodeEnum.DE]);
    });
  });

  describe("appendMember", () => {
    it("should add new member to the stack", () => {
      // Arrange
      // Act
      stack.appendMember(LanguageCodeEnum.EN);

      // Assert
      expect(stack.getMembers()).toContain(LanguageCodeEnum.EN);
    });

    it("should not add duplicate members", () => {
      // Arrange
      stack.appendMember(LanguageCodeEnum.EN);

      // Act
      stack.appendMember(LanguageCodeEnum.EN);

      // Assert
      expect(stack.getMembers()).toEqual([LanguageCodeEnum.EN]);
    });

    it("should remove oldest member when exceeding max capacity", () => {
      // Arrange
      const languages = [
        LanguageCodeEnum.EN,
        LanguageCodeEnum.PL,
        LanguageCodeEnum.DE,
        LanguageCodeEnum.FR,
        LanguageCodeEnum.ES,
        LanguageCodeEnum.IT,
        LanguageCodeEnum.RU,
        LanguageCodeEnum.JA,
        LanguageCodeEnum.KO,
        LanguageCodeEnum.ZH,
      ];

      expect(languages.length).toBe(10);

      languages.forEach(lang => stack.appendMember(lang));

      // Act
      stack.appendMember(LanguageCodeEnum.AR);

      // Assert
      const members = stack.getMembers();

      expect(members).not.toContain(LanguageCodeEnum.EN);
      expect(members).toContain(LanguageCodeEnum.AR);
      expect(members.length).toBe(10);
    });

    it("should return the updated members set", () => {
      // Arrange
      // Act
      const result = stack.appendMember(LanguageCodeEnum.EN);

      // Assert
      expect(result).toBeInstanceOf(Set);
      expect(result.has(LanguageCodeEnum.EN)).toBe(true);
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
      result.current.pushValue(LanguageCodeEnum.EN);
    });

    // Assert
    expect(result.current.cachedValues).toContain(LanguageCodeEnum.EN);
  });

  it("Values are reversed", () => {
    // Arrange
    const { result } = renderHook(() => useCachedLocales());

    const languages = [
      LanguageCodeEnum.EN,
      LanguageCodeEnum.PL,
      LanguageCodeEnum.DE,
      LanguageCodeEnum.FR,
      LanguageCodeEnum.ES,
    ];

    // Act
    act(() => {
      languages.forEach(lang => result.current.pushValue(lang));
    });

    // Assert
    expect(result.current.cachedValues).toEqual([...languages].reverse());
  });
});
