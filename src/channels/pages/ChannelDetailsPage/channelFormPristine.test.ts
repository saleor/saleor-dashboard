import { type FormData } from "@dashboard/channels/components/ChannelForm/ChannelForm";
import {
  AllocationStrategyEnum,
  MarkAsPaidStrategyEnum,
  TransactionFlowStrategyEnum,
} from "@dashboard/graphql";

import { isChannelUpdateFormPristine, mergeChannelFormData } from "./channelFormPristine";

const baseForm = {
  name: "Channel",
  slug: "channel",
  currencyCode: "USD",
  defaultCountry: "US",
  shippingZonesIdsToAdd: [],
  shippingZonesIdsToRemove: [],
  warehousesIdsToAdd: [],
  warehousesIdsToRemove: [],
  shippingZonesToDisplay: [{ id: "z1", name: "EU" }],
  warehousesToDisplay: [
    { id: "w1", name: "One" },
    { id: "w2", name: "Two" },
  ],
  allocationStrategy: AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER,
  markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
  expireOrdersAfter: null,
  deleteExpiredOrdersAfter: 60,
  allowUnpaidOrders: false,
  automaticallyConfirmAllNewOrders: true,
  automaticallyFulfillNonShippableGiftCard: true,
  defaultTransactionFlowStrategy: TransactionFlowStrategyEnum.CHARGE,
  releaseFundsForExpiredCheckouts: false,
  checkoutTtlBeforeReleasingFunds: null,
  automaticallyCompleteCheckouts: false,
  automaticCompletionDelay: null,
  automaticCompletionCutOffDate: "",
  automaticCompletionCutOffTime: "",
  allowLegacyGiftCardUse: false,
} as unknown as FormData;

describe("isChannelUpdateFormPristine", () => {
  it("returns true when comparable fields match", () => {
    // Arrange
    const current: FormData = {
      ...baseForm,
      warehousesToDisplay: baseForm.warehousesToDisplay.map(warehouse => ({ ...warehouse })),
    };

    // Act & Assert
    expect(isChannelUpdateFormPristine(current, baseForm)).toBe(true);
  });

  it("returns false when a warehouse is staged for add", () => {
    // Arrange
    const current: FormData = {
      ...baseForm,
      warehousesIdsToAdd: ["w3"],
      warehousesToDisplay: [
        ...baseForm.warehousesToDisplay,
        {
          __typename: "Warehouse",
          id: "w3",
          name: "Three",
        } as FormData["warehousesToDisplay"][number],
      ],
    };

    // Act & Assert
    expect(isChannelUpdateFormPristine(current, baseForm)).toBe(false);
  });

  it("returns false when warehouse order changes", () => {
    // Arrange
    const current: FormData = {
      ...baseForm,
      warehousesToDisplay: [baseForm.warehousesToDisplay[1], baseForm.warehousesToDisplay[0]],
    };

    // Act & Assert
    expect(isChannelUpdateFormPristine(current, baseForm)).toBe(false);
  });

  it("treats expireOrdersAfter null and 0 as the same", () => {
    // Arrange
    const current: FormData = {
      ...baseForm,
      expireOrdersAfter: 0,
    };

    // Act & Assert
    expect(isChannelUpdateFormPristine(current, baseForm)).toBe(true);
  });

  it("returns true after add then remove of the same warehouse", () => {
    // Arrange
    const current: FormData = {
      ...baseForm,
      warehousesIdsToAdd: [],
      warehousesIdsToRemove: [],
      warehousesToDisplay: [...baseForm.warehousesToDisplay],
    };

    // Act & Assert
    expect(isChannelUpdateFormPristine(current, baseForm)).toBe(true);
  });

  it("treats stale add deltas as pristine when display already matches baseline", () => {
    // Arrange — leftovers after Save before merge clears them
    const current: FormData = {
      ...baseForm,
      warehousesIdsToAdd: ["w3"],
      warehousesToDisplay: [...baseForm.warehousesToDisplay],
    };

    // Act & Assert
    expect(isChannelUpdateFormPristine(current, baseForm)).toBe(true);
  });
});

describe("mergeChannelFormData", () => {
  it("clears staged assignment deltas when the saved baseline refreshes", () => {
    // Arrange
    const prevData = baseForm;
    const prevState: FormData = {
      ...baseForm,
      warehousesIdsToAdd: ["w3"],
      warehousesToDisplay: [
        ...baseForm.warehousesToDisplay,
        {
          __typename: "Warehouse",
          id: "w3",
          name: "Three",
        } as FormData["warehousesToDisplay"][number],
      ],
    };
    const nextData: FormData = {
      ...baseForm,
      warehousesToDisplay: [
        ...baseForm.warehousesToDisplay,
        {
          __typename: "Warehouse",
          id: "w3",
          name: "Three",
        } as FormData["warehousesToDisplay"][number],
      ],
    };

    // Act
    const merged = mergeChannelFormData(prevData, prevState, nextData);

    // Assert
    expect(merged.warehousesIdsToAdd).toEqual([]);
    expect(merged.warehousesToDisplay.map(warehouse => warehouse.id)).toEqual(["w1", "w2", "w3"]);
  });

  it("keeps staged warehouse deltas when only unrelated fields refresh", () => {
    // Arrange
    const prevData = baseForm;
    const prevState: FormData = {
      ...baseForm,
      warehousesIdsToAdd: ["w3"],
      warehousesToDisplay: [
        ...baseForm.warehousesToDisplay,
        {
          __typename: "Warehouse",
          id: "w3",
          name: "Three",
        } as FormData["warehousesToDisplay"][number],
      ],
    };
    const nextData: FormData = {
      ...baseForm,
      name: "Renamed elsewhere",
    };

    // Act
    const merged = mergeChannelFormData(prevData, prevState, nextData);

    // Assert
    expect(merged.name).toBe("Renamed elsewhere");
    expect(merged.warehousesIdsToAdd).toEqual(["w3"]);
    expect(merged.warehousesToDisplay.map(warehouse => warehouse.id)).toEqual(["w1", "w2", "w3"]);
  });

  it("clears stale warehouse deltas when display already matches the baseline", () => {
    // Arrange — e.g. after a name-only Save left leftover add ids
    const prevData = baseForm;
    const prevState: FormData = {
      ...baseForm,
      name: "Renamed",
      warehousesIdsToAdd: ["w1"],
    };
    const nextData: FormData = {
      ...baseForm,
      name: "Renamed",
    };

    // Act
    const merged = mergeChannelFormData(prevData, prevState, nextData);

    // Assert
    expect(merged.warehousesIdsToAdd).toEqual([]);
    expect(merged.warehousesToDisplay.map(warehouse => warehouse.id)).toEqual(["w1", "w2"]);
  });
});
