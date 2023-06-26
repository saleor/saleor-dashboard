import { FlagsResolver } from "./FlagsResolver";
import { Strategy } from "./Strategy";

jest.mock("./availableFlags", () => ({
  isSupported: () => true,
}));

describe("featureFlags/FlagsResolver", () => {
  it("fetches flags data in given order", async () => {
    // ARRANGE
    const strategy1 = {
      fetchAll: () => ({
        flag1: { enabled: true, value: "test1" },
      }),
    } as unknown as Strategy;

    const strategy2 = {
      fetchAll: () => ({
        flag1: { enabled: true, value: "test2" },
      }),
    } as unknown as Strategy;

    const defaultStrategy = {
      fetchAll: () => ({
        flag1: { enabled: true, value: "default" },
      }),
    } as unknown as Strategy;

    const resolver = new FlagsResolver([strategy1, strategy2], defaultStrategy);

    // ACT
    const results = await resolver.fetchAll().getResult();

    // ASSERT
    expect(results).toEqual([
      { flag1: { enabled: true, value: "test1" } },
      { flag1: { enabled: true, value: "test2" } },
      { flag1: { enabled: true, value: "default" } },
    ]);
  });

  // ARRANGE
  it.each([
    {
      strategies: [
        {
          fetchAll: () => ({
            flag1: { enabled: true, value: "test1" },
          }),
        } as unknown as Strategy,
      ],
      expected: {
        flag1: { enabled: true, value: "test1" },
        flagD: { enabled: true, value: "some default" },
      },
    },
    {
      strategies: [
        {
          fetchAll: () => ({
            flag1: { enabled: true, value: "test1-a" },
          }),
        } as unknown as Strategy,
        {
          fetchAll: () => ({
            flag1: { enabled: true, value: "test1-b" },
            flag2: { enabled: true, value: "test2-b" },
          }),
        } as unknown as Strategy,
        {
          fetchAll: () => ({
            flag1: { enabled: true, value: "test1-c" },
            flag2: { enabled: true, value: "test2-c" },
          }),
        } as unknown as Strategy,
      ],
      expected: {
        flag1: { enabled: true, value: "test1-a" },
        flag2: { enabled: true, value: "test2-b" },
        flagD: { enabled: true, value: "some default" },
      },
    },
  ])(
    "combines flags acorrding to the order",
    async ({ strategies, expected }) => {
      const defaultStrategy = {
        fetchAll: () => ({
          flag1: { enabled: true, value: "default" },
          flagD: { enabled: true, value: "some default" },
        }),
      } as unknown as Strategy;

      const resolver = new FlagsResolver(strategies, defaultStrategy);

      // ACT
      const results = await resolver.fetchAll().combineWithPriorities();

      // ASSERT
      expect(results).toEqual(expected);
    },
  );
});
