import { FlagsResolver } from "./FlagsResolver";
import { Strategy } from "./Strategy";

jest.mock("./availableFlags", () => ({
  isSupported: () => true,
}));
describe("featureFlags/FlagsResolver", () => {
  it("fetches flags data in given order", async () => {
    // Arrange
    const strategy1 = {
      fetchAll: () => ({
        flag1: { enabled: true, payload: "test1" },
      }),
    } as unknown as Strategy;
    const strategy2 = {
      fetchAll: () => ({
        flag1: { enabled: true, payload: "test2" },
      }),
    } as unknown as Strategy;
    const defaultStrategy = {
      fetchAll: () => ({
        flag1: { enabled: true, payload: "default" },
      }),
    } as unknown as Strategy;
    const resolver = new FlagsResolver([strategy1, strategy2], defaultStrategy);
    // Act
    const results = await resolver.fetchAll().getResult();

    // Assert
    expect(results).toEqual([
      { flag1: { enabled: true, payload: "test1" } },
      { flag1: { enabled: true, payload: "test2" } },
      { flag1: { enabled: true, payload: "default" } },
    ]);
  });
  // Arrange
  it.each([
    {
      strategies: [
        {
          fetchAll: () => ({
            flag1: { enabled: true, payload: "test1" },
          }),
        } as unknown as Strategy,
      ],
      expected: {
        flag1: { enabled: true, payload: "test1" },
        flagD: { enabled: true, payload: "some default" },
      },
    },
    {
      strategies: [
        {
          fetchAll: () => ({
            flag1: { enabled: true, payload: "test1-a" },
          }),
        } as unknown as Strategy,
        {
          fetchAll: () => ({
            flag1: { enabled: true, payload: "test1-b" },
            flag2: { enabled: true, payload: "test2-b" },
          }),
        } as unknown as Strategy,
        {
          fetchAll: () => ({
            flag1: { enabled: true, payload: "test1-c" },
            flag2: { enabled: true, payload: "test2-c" },
          }),
        } as unknown as Strategy,
      ],
      expected: {
        flag1: { enabled: true, payload: "test1-a" },
        flag2: { enabled: true, payload: "test2-b" },
        flagD: { enabled: true, payload: "some default" },
      },
    },
  ])("combines flags acorrding to the order", async ({ strategies, expected }) => {
    const defaultStrategy = {
      fetchAll: () => ({
        flag1: { enabled: true, payload: "default" },
        flagD: { enabled: true, payload: "some default" },
      }),
    } as unknown as Strategy;
    const resolver = new FlagsResolver(strategies, defaultStrategy);
    // Act
    const results = await resolver.fetchAll().combineWithPriorities();

    // Assert
    expect(results).toEqual(expected);
  });
});
