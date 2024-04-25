import { MetadataFormData } from "@dashboard/components/Metadata";

import createMetadataUpdateHandler, { ObjectWithMetadata } from "./metadataUpdateHandler";

describe("createMetadataUpdateHandler", () => {
  it("should return array of errors when update function return errors", async () => {
    // Arrange
    const intialData: ObjectWithMetadata = {
      id: "testId",
      metadata: [],
      privateMetadata: [],
    };
    const data: MetadataFormData = {
      metadata: [],
      privateMetadata: [],
    };
    const updateFun = jest.fn(() => Promise.resolve(["error1", "error2"]));
    const metadataUpdateFun = jest.fn();
    const privateMetadataUpdateFun = jest.fn();
    // Act
    const handleUpdate = await createMetadataUpdateHandler(
      intialData,
      updateFun,
      metadataUpdateFun,
      privateMetadataUpdateFun,
    );
    const result = await handleUpdate(data);

    // Assert
    expect(result).toEqual(["error1", "error2"]);
  });
  it("should call only updateMetadata mutation", async () => {
    // Arrange
    const intialData: ObjectWithMetadata = {
      id: "testId",
      metadata: [],
      privateMetadata: [],
    };
    const data: MetadataFormData = {
      metadata: [
        {
          key: "testKey",
          value: "testValue",
        },
      ],
      privateMetadata: [],
    };
    const updateFun = jest.fn(() => Promise.resolve([])) as any;
    const metadataUpdateFun = jest.fn(() =>
      Promise.resolve({
        data: {},
      }),
    ) as any;
    const privateMetadataUpdateFun = jest.fn();
    // Act
    const handleUpdate = await createMetadataUpdateHandler(
      intialData,
      updateFun,
      metadataUpdateFun,
      privateMetadataUpdateFun,
    );
    const result = await handleUpdate(data);

    // Assert
    expect(result).toEqual([]);
    expect(metadataUpdateFun).toHaveBeenLastCalledWith({
      id: intialData.id,
      input: [
        {
          key: "testKey",
          value: "testValue",
        },
      ],
      keysToDelete: [],
    });
    expect(privateMetadataUpdateFun).not.toHaveBeenCalled();
  });
  it("should call only updatePrivateMetadata mutation", async () => {
    // Arrange
    const intialData: ObjectWithMetadata = {
      id: "testId",
      metadata: [],
      privateMetadata: [],
    };
    const data: MetadataFormData = {
      metadata: [],
      privateMetadata: [
        {
          key: "testKey",
          value: "testValue",
        },
      ],
    };
    const updateFun = jest.fn(() => Promise.resolve([])) as any;
    const metadataUpdateFun = jest.fn();
    const privateMetadataUpdateFun = jest.fn(() =>
      Promise.resolve({
        data: {},
      }),
    ) as any;
    // Act
    const handleUpdate = await createMetadataUpdateHandler(
      intialData,
      updateFun,
      metadataUpdateFun,
      privateMetadataUpdateFun,
    );
    const result = await handleUpdate(data);

    // Assert
    expect(result).toEqual([]);
    expect(privateMetadataUpdateFun).toHaveBeenLastCalledWith({
      id: intialData.id,
      input: [
        {
          key: "testKey",
          value: "testValue",
        },
      ],
      keysToDelete: [],
    });
    expect(metadataUpdateFun).not.toHaveBeenCalled();
  });
  it("should return updateMetadata errors if exists", async () => {
    // Arrange
    const intialData: ObjectWithMetadata = {
      id: "testId",
      metadata: [],
      privateMetadata: [],
    };
    const data: MetadataFormData = {
      metadata: [
        {
          key: "testKey",
          value: "testValue",
        },
      ],
      privateMetadata: [
        {
          key: "privateTestKey",
          value: "privateTestValue",
        },
      ],
    };
    const updateFun = jest.fn(() => Promise.resolve([])) as any;
    const metadataUpdateFun = jest.fn(() =>
      Promise.resolve({
        data: {
          deleteMetadata: {
            errors: ["error1", "error2"],
          },
        },
      }),
    ) as any;
    const privateMetadataUpdateFun = jest.fn();
    // Act
    const handleUpdate = await createMetadataUpdateHandler(
      intialData,
      updateFun,
      metadataUpdateFun,
      privateMetadataUpdateFun,
    );
    const result = await handleUpdate(data);

    // Assert
    expect(result).toEqual(["error1", "error2"]);
    expect(privateMetadataUpdateFun).not.toHaveBeenCalled();
  });
  it("should return updatePrivateMetadata errors if exists", async () => {
    // Arrange
    const intialData: ObjectWithMetadata = {
      id: "testId",
      metadata: [],
      privateMetadata: [],
    };
    const data: MetadataFormData = {
      metadata: [
        {
          key: "testKey",
          value: "testValue",
        },
      ],
      privateMetadata: [
        {
          key: "testKey",
          value: "testValue",
        },
      ],
    };
    const updateFun = jest.fn(() => Promise.resolve([])) as any;
    const metadataUpdateFun = jest.fn(() =>
      Promise.resolve({
        data: {},
      }),
    ) as any;
    const privateMetadataUpdateFun = jest.fn(() =>
      Promise.resolve({
        data: {
          deletePrivateMetadata: {
            errors: ["privateError1", "privateError2"],
          },
        },
      }),
    ) as any;
    // Act
    const handleUpdate = await createMetadataUpdateHandler(
      intialData,
      updateFun,
      metadataUpdateFun,
      privateMetadataUpdateFun,
    );
    const result = await handleUpdate(data);

    // Assert
    expect(metadataUpdateFun).toHaveBeenCalled();
    expect(result).toEqual(["privateError1", "privateError2"]);
  });
});
