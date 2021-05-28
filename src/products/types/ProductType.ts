export interface ProductTypeData_node {
    id: string;
    name: string;
    slug: string;
}

export interface ProductTypeData_edge {
    node: ProductTypeData_node;
}

export interface ProductTypeData_edges {
    edges: ProductTypeData_edge[];
}

export interface ProductTypeData_search {
    search: ProductTypeData_edges;
}

export interface ProductTypeData {
    data: ProductTypeData_search
}


export interface ProductTypeDataVariables {
    first: number;
    query: string;
}

