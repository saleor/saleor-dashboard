import { renderHook } from "@testing-library/react";

import { useShippingZoneEditChanges } from "./useShippingZoneEditChanges";

describe("useShippingZoneEditChanges", () => {
  const initialFormData = {
    name: "Europe",
    description: "EU shipping",
    warehouses: [{ label: "Warehouse A", value: "wh-1" }],
    channels: [{ label: "USD", value: "ch-1" }],
  };

  it("reports no changes on initial load", () => {
    // Act
    const { result } = renderHook(() =>
      useShippingZoneEditChanges({
        formData: initialFormData,
        initialFormData,
      }),
    );

    // Assert
    expect(result.current).toBe(false);
  });

  it("reports changes when name is edited", () => {
    // Act
    const { result } = renderHook(() =>
      useShippingZoneEditChanges({
        formData: { ...initialFormData, name: "Europe updated" },
        initialFormData,
      }),
    );

    // Assert
    expect(result.current).toBe(true);
  });

  it("reports changes when warehouses are edited", () => {
    // Act
    const { result } = renderHook(() =>
      useShippingZoneEditChanges({
        formData: {
          ...initialFormData,
          warehouses: [...initialFormData.warehouses, { label: "Warehouse B", value: "wh-2" }],
        },
        initialFormData,
      }),
    );

    // Assert
    expect(result.current).toBe(true);
  });

  it("does not report changes when multiselect selection order differs", () => {
    // Act
    const { result } = renderHook(() =>
      useShippingZoneEditChanges({
        formData: {
          ...initialFormData,
          channels: [
            { label: "EUR", value: "ch-2" },
            { label: "USD", value: "ch-1" },
          ],
        },
        initialFormData: {
          ...initialFormData,
          channels: [
            { label: "USD", value: "ch-1" },
            { label: "EUR", value: "ch-2" },
          ],
        },
      }),
    );

    // Assert
    expect(result.current).toBe(false);
  });

  it("does not report changes when multiselect values match but labels differ", () => {
    // Act
    const { result } = renderHook(() =>
      useShippingZoneEditChanges({
        formData: {
          ...initialFormData,
          channels: [{ label: "Renamed channel", value: "ch-1" }],
        },
        initialFormData,
      }),
    );

    // Assert
    expect(result.current).toBe(false);
  });
});
