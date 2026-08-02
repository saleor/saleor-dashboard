import { type FormData } from "@dashboard/channels/components/ChannelForm/ChannelForm";
import {
  AllocationStrategyEnum,
  MarkAsPaidStrategyEnum,
  TransactionFlowStrategyEnum,
} from "@dashboard/graphql";

import { isChannelUpdateFormPristine } from "./channelFormPristine";
import { buildChannelSaveComposition, hasChannelSaveComposition } from "./saveComposition";

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

describe("buildChannelSaveComposition", () => {
  it("is empty when form matches baseline", () => {
    // Arrange / Act
    const composition = buildChannelSaveComposition(baseForm, baseForm);

    // Assert
    expect(hasChannelSaveComposition(composition)).toBe(false);
  });

  it("marks general when name changes", () => {
    // Arrange / Act
    const composition = buildChannelSaveComposition({ ...baseForm, name: "Renamed" }, baseForm);

    // Assert
    expect(composition.hasGeneral).toBe(true);
    expect(composition.hasOrders).toBe(false);
    expect(hasChannelSaveComposition(composition)).toBe(true);
  });

  it("marks orders when an order setting changes", () => {
    // Arrange / Act
    const composition = buildChannelSaveComposition(
      { ...baseForm, allowUnpaidOrders: true },
      baseForm,
    );

    // Assert
    expect(composition.hasOrders).toBe(true);
    expect(composition.hasGeneral).toBe(false);
  });

  it("marks payments when a checkout setting changes", () => {
    // Arrange / Act
    const composition = buildChannelSaveComposition(
      { ...baseForm, allowLegacyGiftCardUse: true },
      baseForm,
    );

    // Assert
    expect(composition.hasPayments).toBe(true);
  });

  it("marks inventory when warehouses are reordered", () => {
    // Arrange / Act
    const composition = buildChannelSaveComposition(
      {
        ...baseForm,
        warehousesToDisplay: [baseForm.warehousesToDisplay[1], baseForm.warehousesToDisplay[0]],
      },
      baseForm,
    );

    // Assert
    expect(composition.hasInventory).toBe(true);
    expect(composition.hasDelivery).toBe(false);
  });

  it("marks inventory when allocation strategy changes", () => {
    // Arrange / Act
    const composition = buildChannelSaveComposition(
      {
        ...baseForm,
        allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
      },
      baseForm,
    );

    // Assert
    expect(composition.hasInventory).toBe(true);
  });

  it("marks delivery when shipping zones change", () => {
    // Arrange / Act
    const composition = buildChannelSaveComposition(
      {
        ...baseForm,
        shippingZonesToDisplay: [
          ...(baseForm.shippingZonesToDisplay ?? []),
          { __typename: "ShippingZone" as const, id: "z2", name: "US" },
        ],
      },
      baseForm,
    );

    // Assert
    expect(composition.hasDelivery).toBe(true);
    expect(composition.hasInventory).toBe(false);
  });

  it("aggregates multiple dirty sections", () => {
    // Arrange / Act
    const composition = buildChannelSaveComposition(
      {
        ...baseForm,
        name: "Renamed",
        allowUnpaidOrders: true,
        shippingZonesToDisplay: [],
      },
      baseForm,
    );

    // Assert
    expect(composition).toEqual({
      hasGeneral: true,
      hasOrders: true,
      hasPayments: false,
      hasInventory: false,
      hasDelivery: true,
    });
  });

  it("stays aligned with pristine detection", () => {
    // Arrange
    const dirty: FormData = { ...baseForm, slug: "renamed" };
    const reordered: FormData = {
      ...baseForm,
      warehousesToDisplay: [baseForm.warehousesToDisplay[1], baseForm.warehousesToDisplay[0]],
    };

    // Act / Assert — Savebar hint and Save disabled must agree
    expect(hasChannelSaveComposition(buildChannelSaveComposition(baseForm, baseForm))).toBe(
      !isChannelUpdateFormPristine(baseForm, baseForm),
    );
    expect(hasChannelSaveComposition(buildChannelSaveComposition(dirty, baseForm))).toBe(
      !isChannelUpdateFormPristine(dirty, baseForm),
    );
    expect(hasChannelSaveComposition(buildChannelSaveComposition(reordered, baseForm))).toBe(
      !isChannelUpdateFormPristine(reordered, baseForm),
    );
  });
});
