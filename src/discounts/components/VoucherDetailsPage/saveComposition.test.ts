import { type ChannelVoucherData } from "@dashboard/channels/utils";

import { buildVoucherSaveComposition, hasVoucherSaveComposition } from "./saveComposition";

const baselineChannels: ChannelVoucherData[] = [
  {
    id: "channel-1",
    name: "Channel",
    currency: "USD",
    discountValue: "10",
    minSpent: "",
  },
];

const updatedChannels: ChannelVoucherData[] = [
  {
    ...baselineChannels[0],
    discountValue: "15",
  },
];

describe("buildVoucherSaveComposition", () => {
  it("returns general when a general field was changed", () => {
    // Arrange
    const composition = buildVoucherSaveComposition(
      ["name"],
      baselineChannels,
      baselineChannels,
      0,
    );

    // Assert
    expect(composition.hasGeneral).toBe(true);
    expect(composition.hasChannels).toBe(false);
    expect(composition.hasCodes).toBe(false);
    expect(composition.hasCatalogue).toBe(false);
    expect(composition.hasCountries).toBe(false);
    expect(hasVoucherSaveComposition(composition)).toBe(true);
  });

  it("returns catalogue and countries when staged membership is pending", () => {
    // Arrange
    const composition = buildVoucherSaveComposition([], baselineChannels, baselineChannels, 0, {
      hasCatalogue: true,
      hasCountries: true,
    });

    // Assert
    expect(composition.hasCatalogue).toBe(true);
    expect(composition.hasCountries).toBe(true);
    expect(hasVoucherSaveComposition(composition)).toBe(true);
  });

  it("returns channels when channel listings differ from baseline", () => {
    // Arrange
    const composition = buildVoucherSaveComposition([], updatedChannels, baselineChannels, 0);

    // Assert
    expect(composition.hasGeneral).toBe(false);
    expect(composition.hasChannels).toBe(true);
    expect(hasVoucherSaveComposition(composition)).toBe(true);
  });

  it("returns channels when channel membership changes", () => {
    // Arrange
    const composition = buildVoucherSaveComposition(
      [],
      [
        ...baselineChannels,
        {
          id: "channel-2",
          name: "Other",
          currency: "EUR",
          discountValue: "",
          minSpent: "",
        },
      ],
      baselineChannels,
      0,
    );

    // Assert
    expect(composition.hasChannels).toBe(true);
  });

  it("does not return channels when listings match baseline", () => {
    // Arrange
    const composition = buildVoucherSaveComposition([], baselineChannels, baselineChannels, 0);

    // Assert
    expect(composition.hasChannels).toBe(false);
    expect(hasVoucherSaveComposition(composition)).toBe(false);
  });

  it("returns codes when draft codes are pending save", () => {
    // Arrange
    const composition = buildVoucherSaveComposition([], baselineChannels, baselineChannels, 2);

    // Assert
    expect(composition.hasCodes).toBe(true);
    expect(hasVoucherSaveComposition(composition)).toBe(true);
  });

  it("returns general for schedule field changes", () => {
    // Arrange
    const composition = buildVoucherSaveComposition(
      ["startDate"],
      baselineChannels,
      baselineChannels,
      0,
    );

    // Assert
    expect(composition.hasGeneral).toBe(true);
  });

  it("ignores unrelated changed fields for general", () => {
    // Arrange
    const composition = buildVoucherSaveComposition(
      ["codes"],
      baselineChannels,
      baselineChannels,
      0,
    );

    // Assert
    expect(composition.hasGeneral).toBe(false);
  });
});
