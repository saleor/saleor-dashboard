import { getAbsoluteApiUrl } from "@dashboard/config";
import { newTabActions, prepareFormValues } from "@dashboard/extensions/new-tab-actions";

jest.mock("@dashboard/config");

describe("prepareFormValues", () => {
  it("Renders flat array of tuples with key and value", () => {
    // Arrange
    const record = {
      productId: "product-1",
      orderIds: ["o1", "o2"],
      customerId: undefined,
    };

    // Act & Assert
    expect(prepareFormValues(record)).toEqual([
      ["productId", "product-1"],
      ["orderIds", "o1"],
      ["orderIds", "o2"],
    ]);
  });

  it("Handles empty object", () => {
    // Arrange
    const record = {};

    // Act & Assert
    expect(prepareFormValues(record)).toEqual([]);
  });

  it("Handles object with only undefined values", () => {
    // Arrange
    const record = {
      customerId: undefined,
      productId: undefined,
    };

    // Act & Assert
    expect(prepareFormValues(record)).toEqual([]);
  });

  it("Handles object with only null values", () => {
    // Arrange
    const record = {
      customerId: null,
      productId: null,
    };

    // Act & Assert
    expect(prepareFormValues(record)).toEqual([]);
  });

  it("Handles empty arrays", () => {
    // Arrange
    const record = {
      orderIds: [],
      productIds: [],
    };

    // Act & Assert
    expect(prepareFormValues(record)).toEqual([]);
  });

  it("Handles string values only", () => {
    // Arrange
    const record = {
      accessToken: "token-123",
      appId: "app-456",
      saleorApiUrl: "https://example.com/graphql/",
    };

    // Act & Assert
    expect(prepareFormValues(record)).toEqual([
      ["accessToken", "token-123"],
      ["appId", "app-456"],
      ["saleorApiUrl", "https://example.com/graphql/"],
    ]);
  });

  it("Handles array values only", () => {
    // Arrange
    const record = {
      orderIds: ["o1", "o2", "o3"],
      productIds: ["p1", "p2"],
    };

    // Act & Assert
    expect(prepareFormValues(record)).toEqual([
      ["orderIds", "o1"],
      ["orderIds", "o2"],
      ["orderIds", "o3"],
      ["productIds", "p1"],
      ["productIds", "p2"],
    ]);
  });

  it("Handles empty string values", () => {
    // Arrange
    const record = {
      productId: "",
      customerId: "",
    };

    // Act & Assert
    expect(prepareFormValues(record)).toEqual([
      ["productId", ""],
      ["customerId", ""],
    ]);
  });

  it("Handles single item arrays", () => {
    // Arrange
    const record = {
      orderId: ["o1"],
    };

    // Act & Assert
    expect(prepareFormValues(record)).toEqual([["orderId", "o1"]]);
  });

  it("Preserves order of keys", () => {
    // Arrange
    const record = {
      firstKey: "value1",
      secondKey: "value2",
      thirdKey: "value3",
    };

    // Act & Assert
    const result = prepareFormValues(record);

    expect(result[0][0]).toBe("firstKey");
    expect(result[1][0]).toBe("secondKey");
    expect(result[2][0]).toBe("thirdKey");
  });

  it("Handles mixed null, undefined, and valid values", () => {
    // Arrange
    const record = {
      validString: "test",
      nullValue: null,
      undefinedValue: undefined,
      validArray: ["item1", "item2"],
      emptyArray: [],
    };

    // Act & Assert
    expect(prepareFormValues(record)).toEqual([
      ["validString", "test"],
      ["validArray", "item1"],
      ["validArray", "item2"],
    ]);
  });
});

describe("newTabActions", () => {
  describe("openGETinNewTab", () => {
    let windowOpenSpy: jest.SpyInstance;

    beforeEach(() => {
      windowOpenSpy = jest.spyOn(window, "open").mockImplementation();
    });

    afterEach(() => {
      windowOpenSpy.mockRestore();
    });

    it("Opens URL in new tab using window.open", () => {
      // Arrange
      const extensionUrl = "https://example.com/extension";

      // Act
      newTabActions.openGETinNewTab(extensionUrl);

      // Assert
      expect(windowOpenSpy).toHaveBeenCalledWith(extensionUrl, "_blank");
      expect(windowOpenSpy).toHaveBeenCalledTimes(1);
    });

    it("Handles empty URL", () => {
      // Arrange
      const extensionUrl = "";

      // Act
      newTabActions.openGETinNewTab(extensionUrl);

      // Assert
      expect(windowOpenSpy).toHaveBeenCalledWith(extensionUrl, "_blank");
    });

    it("Handles URL with query parameters", () => {
      // Arrange
      const extensionUrl = "https://example.com/extension?foo=bar&baz=qux";

      // Act
      newTabActions.openGETinNewTab(extensionUrl);

      // Assert
      expect(windowOpenSpy).toHaveBeenCalledWith(extensionUrl, "_blank");
    });
  });

  describe("openPOSTinNewTab", () => {
    let submitSpy: jest.SpyInstance;

    beforeEach(() => {
      // Spy on form.submit() to prevent actual form submission
      submitSpy = jest.spyOn(HTMLFormElement.prototype, "submit").mockImplementation();

      (getAbsoluteApiUrl as jest.Mock).mockReturnValue("https://api.example.com/graphql/");
    });

    afterEach(() => {
      submitSpy.mockRestore();
      jest.clearAllMocks();
    });

    it("Creates form with correct method, action and target", () => {
      // Arrange
      const args = {
        appParams: {},
        accessToken: "token-123",
        appId: "app-456",
        extensionUrl: "https://extension.example.com",
      };

      // Act
      newTabActions.openPOSTinNewTab(args);

      // Assert
      const form = submitSpy.mock.instances[0] as HTMLFormElement;

      expect(form.method).toBe("post");
      expect(form.action).toBe("https://extension.example.com/");
      expect(form.target).toBe("_blank");
      expect(form.style.display).toBe("none");
      expect(submitSpy).toHaveBeenCalledTimes(1);
    });

    it("Creates input elements for all form parameters", () => {
      // Arrange
      const args = {
        appParams: { productId: "prod-1", customerId: "cust-1" },
        accessToken: "token-123",
        appId: "app-456",
        extensionUrl: "https://extension.example.com",
      };

      // Act
      newTabActions.openPOSTinNewTab(args);

      // Assert
      const form = submitSpy.mock.instances[0] as HTMLFormElement;
      const inputs = Array.from(form.querySelectorAll("input"));

      expect(inputs).toHaveLength(5);
      expect(inputs[0].name).toBe("productId");
      expect(inputs[0].value).toBe("prod-1");
      expect(inputs[0].type).toBe("hidden");

      expect(inputs[1].name).toBe("customerId");
      expect(inputs[1].value).toBe("cust-1");

      expect(inputs[2].name).toBe("accessToken");
      expect(inputs[2].value).toBe("token-123");

      expect(inputs[3].name).toBe("appId");
      expect(inputs[3].value).toBe("app-456");

      expect(inputs[4].name).toBe("saleorApiUrl");
      expect(inputs[4].value).toBe("https://api.example.com/graphql/");

      expect(submitSpy).toHaveBeenCalledTimes(1);
    });

    it("Includes saleorApiUrl from config", () => {
      // Arrange
      const args = {
        appParams: {},
        accessToken: "token-123",
        appId: "app-456",
        extensionUrl: "https://extension.example.com",
      };

      // Act
      newTabActions.openPOSTinNewTab(args);

      // Assert
      const form = submitSpy.mock.instances[0] as HTMLFormElement;
      const inputs = Array.from(form.querySelectorAll("input"));
      const saleorApiUrlInput = inputs.find(input => input.name === "saleorApiUrl");

      expect(saleorApiUrlInput).toBeDefined();
      expect(saleorApiUrlInput?.value).toBe("https://api.example.com/graphql/");
      expect(getAbsoluteApiUrl).toHaveBeenCalledTimes(1);
      expect(submitSpy).toHaveBeenCalledTimes(1);
    });

    it("Handles array parameters by creating multiple inputs with same name", () => {
      // Arrange
      const args = {
        appParams: { productIds: ["p1", "p2", "p3"] },
        accessToken: "token-123",
        appId: "app-456",
        extensionUrl: "https://extension.example.com",
      };

      // Act
      newTabActions.openPOSTinNewTab(args);

      // Assert
      const form = submitSpy.mock.instances[0] as HTMLFormElement;
      const inputs = Array.from(form.querySelectorAll("input"));
      const productInputs = inputs.filter(input => input.name === "productIds");

      expect(productInputs).toHaveLength(3);
      expect(productInputs[0].value).toBe("p1");
      expect(productInputs[1].value).toBe("p2");
      expect(productInputs[2].value).toBe("p3");
      expect(submitSpy).toHaveBeenCalledTimes(1);
    });

    it("Filters out null and undefined parameters", () => {
      // Arrange
      const args = {
        appParams: {
          productId: "prod-1",
        } as any,
        accessToken: null,
        appId: "app-456",
        extensionUrl: "https://extension.example.com",
      };

      // Manually add invalid properties for testing
      (args.appParams as any).customerId = null;
      (args.appParams as any).orderId = undefined;

      // Act
      newTabActions.openPOSTinNewTab(args);

      // Assert
      const form = submitSpy.mock.instances[0] as HTMLFormElement;
      const inputs = Array.from(form.querySelectorAll("input"));
      const paramNames = inputs.map(input => input.name);

      expect(paramNames).toContain("productId");
      expect(paramNames).toContain("appId");
      expect(paramNames).not.toContain("customerId");
      expect(paramNames).not.toContain("orderId");
      expect(paramNames).not.toContain("accessToken");
      expect(submitSpy).toHaveBeenCalledTimes(1);
    });

    it("Handles empty appParams", () => {
      // Arrange
      const args = {
        appParams: {},
        accessToken: "token-123",
        appId: "app-456",
        extensionUrl: "https://extension.example.com",
      };

      // Act
      newTabActions.openPOSTinNewTab(args);

      // Assert
      const form = submitSpy.mock.instances[0] as HTMLFormElement;
      const inputs = Array.from(form.querySelectorAll("input"));

      expect(inputs.length).toBeGreaterThan(0);

      const paramNames = inputs.map(input => input.name);

      expect(paramNames).toContain("accessToken");
      expect(paramNames).toContain("appId");
      expect(paramNames).toContain("saleorApiUrl");
      expect(submitSpy).toHaveBeenCalledTimes(1);
    });

    it("Handles complex mixed parameters", () => {
      // Arrange
      const args = {
        appParams: {
          productId: "prod-1",
          customerIds: ["c1", "c2"],
        } as any,
        accessToken: "token-123",
        appId: "app-456",
        extensionUrl: "https://extension.example.com",
      };

      // Manually add properties with null and empty arrays for testing
      (args.appParams as any).customerId = null;
      (args.appParams as any).collectionIds = [];

      // Act
      newTabActions.openPOSTinNewTab(args);

      // Assert
      const form = submitSpy.mock.instances[0] as HTMLFormElement;
      const inputs = Array.from(form.querySelectorAll("input"));
      const productIdInputs = inputs.filter(input => input.name === "productId");
      const customerIdsInputs = inputs.filter(input => input.name === "customerIds");
      const customerIdInputs = inputs.filter(input => input.name === "customerId");
      const collectionIdsInputs = inputs.filter(input => input.name === "collectionIds");

      expect(productIdInputs).toHaveLength(1);
      expect(customerIdsInputs).toHaveLength(2);
      expect(customerIdInputs).toHaveLength(0);
      expect(collectionIdsInputs).toHaveLength(0);
      expect(submitSpy).toHaveBeenCalledTimes(1);
    });
  });
});
