export interface ProductPrivateMetadataData_privateMetadata{
    key: string;
    value: string;
}
export interface ProductPrivateMetadataData_product {
    privateMetadata:ProductPrivateMetadataData_privateMetadata[];
}
export interface ProductPrivateMetadataData {
    product: ProductPrivateMetadataData_product;
}
export interface ProductPrivateMetadataDataVariables {
    id: string;
}
