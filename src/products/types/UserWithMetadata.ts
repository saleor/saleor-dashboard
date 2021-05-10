export interface UserWithMetadataData_privateMetadata{
    key: string;
    value: string;
}


export interface UserWithMetadataData {
    privateMetadata: UserWithMetadataData_privateMetadata;
}

export interface UserWithMetadataDataVariables {
    id: string;
}