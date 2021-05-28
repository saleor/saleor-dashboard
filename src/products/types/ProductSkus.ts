export interface ProductsSkusData_variant{
    sku: string;
}

export interface ProductsSkusData_nodes{
    name: string;
    defaultVariant: ProductsSkusData_variant
}

export interface ProductsSkusData_edges{
    node: ProductsSkusData_nodes;
}
export interface ProductsSkusData_products {
    edges: ProductsSkusData_edges[];
}
export interface ProductsSkusData {
    products: ProductsSkusData_products;
}
export interface ProductsSkusDataVariables {
    ids: string[];
}
