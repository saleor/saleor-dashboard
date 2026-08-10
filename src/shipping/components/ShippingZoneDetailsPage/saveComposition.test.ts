import { type Option } from "@saleor/macaw-ui-next";

import {
  buildShippingZoneSaveComposition,
  hasShippingZoneSaveComposition,
} from "./saveComposition";
import { type ShippingZoneUpdateFormData } from "./types";

const baseFormData: ShippingZoneUpdateFormData = {
  name: "Europe",
  description: "EU zone",
  channels: [{ label: "Default", value: "ch1" }],
  warehouses: [{ label: "Warehouse", value: "wh1" }],
};

describe("buildShippingZoneSaveComposition", () => {
  it("returns general when name changes", () => {
    // Arrange
    const composition = buildShippingZoneSaveComposition(
      { ...baseFormData, name: "Updated" },
      baseFormData,
    );

    // Assert
    expect(composition.hasGeneral).toBe(true);
    expect(hasShippingZoneSaveComposition(composition)).toBe(true);
  });

  it("returns channels when channel selection changes", () => {
    // Arrange
    const nextChannels: Option[] = [
      { label: "Default", value: "ch1" },
      { label: "US", value: "ch2" },
    ];
    const composition = buildShippingZoneSaveComposition(
      { ...baseFormData, channels: nextChannels },
      baseFormData,
    );

    // Assert
    expect(composition.hasChannels).toBe(true);
    expect(composition.hasGeneral).toBe(false);
  });

  it("returns warehouses when warehouse selection changes", () => {
    // Arrange
    const composition = buildShippingZoneSaveComposition(
      { ...baseFormData, warehouses: [] },
      baseFormData,
    );

    // Assert
    expect(composition.hasWarehouses).toBe(true);
  });
});
