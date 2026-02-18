import {
  defineAttributeCountableConnectionFactory,
  defineAttributeCountableEdgeFactory,
  defineCategoryCountableConnectionFactory,
  defineCategoryCountableEdgeFactory,
  defineCollectionCountableConnectionFactory,
  defineCollectionCountableEdgeFactory,
  definePageTypeCountableConnectionFactory,
  definePageTypeCountableEdgeFactory,
  defineProductTypeCountableConnectionFactory,
  defineProductTypeCountableEdgeFactory,
} from "@dashboard/graphql/fabbrica.generated";
import { dynamic } from "@mizdra/graphql-codegen-typescript-fabbrica/helper";

import {
  AttributeFactory,
  CategoryFactory,
  CollectionFactory,
  PageTypeFactory,
  ProductTypeFactory,
} from "./factories";

export const ProductTypeEdgeFactory = defineProductTypeCountableEdgeFactory({
  defaultFields: {
    __typename: "ProductTypeCountableEdge",
    node: dynamic(() => ProductTypeFactory.build()),
  },
});

export const ProductTypeConnectionFactory = defineProductTypeCountableConnectionFactory({
  defaultFields: {
    __typename: "ProductTypeCountableConnection",
    edges: dynamic(() => ProductTypeEdgeFactory.buildList(2)),
  },
});

export const CategoryEdgeFactory = defineCategoryCountableEdgeFactory({
  defaultFields: {
    __typename: "CategoryCountableEdge",
    node: dynamic(() => CategoryFactory.build()),
  },
});

export const CategoryConnectionFactory = defineCategoryCountableConnectionFactory({
  defaultFields: {
    __typename: "CategoryCountableConnection",
    edges: dynamic(() => CategoryEdgeFactory.buildList(2)),
  },
});

export const CollectionEdgeFactory = defineCollectionCountableEdgeFactory({
  defaultFields: {
    __typename: "CollectionCountableEdge",
    node: dynamic(() => CollectionFactory.build()),
  },
});

export const CollectionConnectionFactory = defineCollectionCountableConnectionFactory({
  defaultFields: {
    __typename: "CollectionCountableConnection",
    edges: dynamic(() => CollectionEdgeFactory.buildList(2)),
  },
});

export const AttributeEdgeFactory = defineAttributeCountableEdgeFactory({
  defaultFields: {
    __typename: "AttributeCountableEdge",
    node: dynamic(() => AttributeFactory.build()),
  },
});

export const AttributeConnectionFactory = defineAttributeCountableConnectionFactory({
  defaultFields: {
    __typename: "AttributeCountableConnection",
    edges: dynamic(() => AttributeEdgeFactory.buildList(2)),
  },
});

export const PageTypeEdgeFactory = definePageTypeCountableEdgeFactory({
  defaultFields: {
    __typename: "PageTypeCountableEdge",
    node: dynamic(() => PageTypeFactory.build()),
  },
});

export const PageTypeConnectionFactory = definePageTypeCountableConnectionFactory({
  defaultFields: {
    __typename: "PageTypeCountableConnection",
    edges: dynamic(() => PageTypeEdgeFactory.buildList(2)),
  },
});
