import { type FetchResult } from "@apollo/client";
import { type MetadataFormData } from "@dashboard/components/Metadata/types";
import {
  type UpdateMetadataMutation,
  type UpdateMetadataMutationVariables,
  type UpdatePrivateMetadataMutation,
  type UpdatePrivateMetadataMutationVariables,
} from "@dashboard/graphql";

import createMetadataUpdateHandler, { type ObjectWithMetadata } from "./metadataUpdateHandler";

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

describe("createMetadataUpdateHandler — what a save writes", () => {
  // Loaded by the form. An app may change any of these keys after that.
  const loaded: ObjectWithMetadata = {
    id: "U2hvcDox",
    metadata: [
      { key: "seller.legalName", value: "Example GmbH" },
      { key: "seller.vatId", value: "DE000000000" },
      { key: "seller.register", value: "HRB 000000 B" },
    ],
    privateMetadata: [
      { key: "carrier.ioss", value: "IM0000000000" },
      { key: "app.config", value: "{}" },
    ],
  };

  const metadataSaved: FetchResult<UpdateMetadataMutation> = {
    data: {
      __typename: "Mutation",
      updateMetadata: { __typename: "UpdateMetadata", errors: [], item: null },
      deleteMetadata: { __typename: "DeleteMetadata", errors: [], item: null },
    },
  };
  const privateMetadataSaved: FetchResult<UpdatePrivateMetadataMutation> = {
    data: {
      __typename: "Mutation",
      updatePrivateMetadata: { __typename: "UpdatePrivateMetadata", errors: [], item: null },
      deletePrivateMetadata: { __typename: "DeletePrivateMetadata", errors: [], item: null },
    },
  };

  const setup = () => {
    const updateMetadata = jest.fn((_variables: UpdateMetadataMutationVariables) =>
      Promise.resolve(metadataSaved),
    );
    const updatePrivateMetadata = jest.fn((_variables: UpdatePrivateMetadataMutationVariables) =>
      Promise.resolve(privateMetadataSaved),
    );
    const noEntityErrors: string[] = [];
    const handleSubmit = createMetadataUpdateHandler<MetadataFormData, string>(
      loaded,
      () => Promise.resolve(noEntityErrors),
      updateMetadata,
      updatePrivateMetadata,
    );

    return { handleSubmit, updateMetadata, updatePrivateMetadata };
  };

  it("sends only the edited and added entries, so untouched keys keep newer values", async () => {
    // Arrange
    const { handleSubmit, updateMetadata, updatePrivateMetadata } = setup();
    const submitted: MetadataFormData = {
      metadata: [
        { key: "seller.legalName", value: "Example AG" },
        { key: "seller.vatId", value: "DE000000000" },
        { key: "seller.register", value: "HRB 000000 B" },
        { key: "seller.email", value: "hello@example.com" },
      ],
      privateMetadata: loaded.privateMetadata,
    };

    // Act
    const errors = await handleSubmit(submitted);

    // Assert
    expect(errors).toEqual([]);
    expect(updateMetadata).toHaveBeenCalledWith({
      id: loaded.id,
      input: [
        { key: "seller.legalName", value: "Example AG" },
        { key: "seller.email", value: "hello@example.com" },
      ],
      keysToDelete: [],
    });
    expect(updatePrivateMetadata).not.toHaveBeenCalled();
  });

  it("deletes a removed key and adds a renamed one without resending the rest", async () => {
    // Arrange
    const { handleSubmit, updateMetadata } = setup();
    const submitted: MetadataFormData = {
      metadata: [
        { key: "seller.legalName", value: "Example GmbH" },
        { key: "seller.vatNumber", value: "DE000000000" },
      ],
      privateMetadata: loaded.privateMetadata,
    };

    // Act
    await handleSubmit(submitted);

    // Assert
    expect(updateMetadata).toHaveBeenCalledWith({
      id: loaded.id,
      input: [{ key: "seller.vatNumber", value: "DE000000000" }],
      keysToDelete: ["seller.vatId", "seller.register"],
    });
  });

  it("sends only the edited private entry", async () => {
    // Arrange
    const { handleSubmit, updateMetadata, updatePrivateMetadata } = setup();
    const submitted: MetadataFormData = {
      metadata: loaded.metadata,
      privateMetadata: [
        { key: "carrier.ioss", value: "IM1111111111" },
        { key: "app.config", value: "{}" },
      ],
    };

    // Act
    await handleSubmit(submitted);

    // Assert
    expect(updatePrivateMetadata).toHaveBeenCalledWith({
      id: loaded.id,
      input: [{ key: "carrier.ioss", value: "IM1111111111" }],
      keysToDelete: [],
    });
    expect(updateMetadata).not.toHaveBeenCalled();
  });

  it("sends nothing when the entries were edited back to what was loaded", async () => {
    // Arrange
    const { handleSubmit, updateMetadata, updatePrivateMetadata } = setup();
    const submitted: MetadataFormData = {
      metadata: [...loaded.metadata].reverse(),
      privateMetadata: loaded.privateMetadata,
    };

    // Act
    await handleSubmit(submitted);

    // Assert
    expect(updateMetadata).not.toHaveBeenCalled();
    expect(updatePrivateMetadata).not.toHaveBeenCalled();
  });
});
