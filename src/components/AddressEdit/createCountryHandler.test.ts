import { type ChangeEvent } from "@dashboard/hooks/useForm";

import { createCountryHandler } from "./createCountryHandler";

describe("createCountryHandler", () => {
  it("calls original country handler and resets the country area field", () => {
    // Arrange
    const originalCountryHandler = jest.fn();
    const setFn = jest.fn();
    const exampleEvent: ChangeEvent = { target: { name: "country", value: "US" } };
    const newHandler = createCountryHandler(originalCountryHandler, setFn);

    // Act
    newHandler(exampleEvent);
    // Assert
    expect(originalCountryHandler).toBeCalledWith(exampleEvent);
    expect(setFn).toBeCalledWith({ countryArea: "" });
  });
});
