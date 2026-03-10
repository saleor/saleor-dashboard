import { classNames } from "./css";

describe("classNames", () => {
  test("should join class names", () => {
    expect(classNames("btn", "btn-main")).toBe("btn btn-main");
  });

  test("should omit empty class names", () => {
    expect(classNames("btn", undefined)).toBe("btn");
  });
});
