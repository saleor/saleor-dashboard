import { UrlEntry, UrlToken } from "../../../ValueProvider/UrlToken";
import { InitialAttributesStateResponse } from "./InitialAttributesState";

describe("ConditionalFilter / API / Page / InitialAttributesState", () => {
  it("should filter by channel", () => {
    // Arrange
    const initialAttributesState = InitialAttributesStateResponse.empty();

    initialAttributesState.channels = [
      {
        label: "Channel 1",
        value: "channel-1",
        slug: "channel-1",
      },
      {
        label: "Channel 2",
        value: "channel-2",
        slug: "channel-2",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.channel", "channel-1"));
    const expectedOutput = [
      {
        label: "Channel 1",
        value: "channel-1",
        slug: "channel-1",
      },
    ];

    // Act
    const result = initialAttributesState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by attributeType", () => {
    // Arrange
    const initialAttributesState = InitialAttributesStateResponse.empty();

    initialAttributesState.attributeTypes = [
      {
        label: "Attribute Type 1",
        value: "attr-1",
        slug: "attr-1",
      },
      {
        label: "Attribute Type 2",
        value: "attr-2",
        slug: "attr-2",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.attributeType", "attr-2"));
    const expectedOutput = [
      {
        label: "Attribute Type 2",
        value: "attr-2",
        slug: "attr-2",
      },
    ];

    // Act
    const result = initialAttributesState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by filterableInStorefront", () => {
    // Arrange
    const initialAttributesState = InitialAttributesStateResponse.empty();

    initialAttributesState.filterableInStorefront = [
      {
        label: "Yes",
        value: "true",
        slug: "true",
      },
      {
        label: "No",
        value: "false",
        slug: "false",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.filterableInStorefront", "false"));
    const expectedOutput = [
      {
        label: "No",
        value: "false",
        slug: "false",
      },
    ];

    // Act
    const result = initialAttributesState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by isVariantOnly", () => {
    // Arrange
    const initialAttributesState = InitialAttributesStateResponse.empty();

    initialAttributesState.isVariantOnly = [
      {
        label: "Yes",
        value: "true",
        slug: "true",
      },
      {
        label: "No",
        value: "false",
        slug: "false",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.isVariantOnly", "false"));
    const expectedOutput = [
      {
        label: "No",
        value: "false",
        slug: "false",
      },
    ];

    // Act
    const result = initialAttributesState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by valueRequired", () => {
    // Arrange
    const initialAttributesState = InitialAttributesStateResponse.empty();

    initialAttributesState.valueRequired = [
      {
        label: "Yes",
        value: "true",
        slug: "true",
      },
      {
        label: "No",
        value: "false",
        slug: "false",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.valueRequired", "false"));
    const expectedOutput = [
      {
        label: "No",
        value: "false",
        slug: "false",
      },
    ];

    // Act
    const result = initialAttributesState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by visibleInStorefront", () => {
    // Arrange
    const initialAttributesState = InitialAttributesStateResponse.empty();

    initialAttributesState.visibleInStorefront = [
      {
        label: "Yes",
        value: "true",
        slug: "true",
      },
      {
        label: "No",
        value: "false",
        slug: "false",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.visibleInStorefront", "false"));
    const expectedOutput = [
      {
        label: "No",
        value: "false",
        slug: "false",
      },
    ];

    // Act
    const result = initialAttributesState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
