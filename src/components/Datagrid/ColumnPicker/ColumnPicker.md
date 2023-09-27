## Column Management Docs

### System Architecture

<img width="858" alt="image" src="https://github.com/saleor/saleor-dashboard/assets/41952692/8ce49003-e2af-4901-9098-fa5deb9bbe66">

### Column types

In datagrid views various types of columns are available. We can split them into two groups:

- static columns - e. g. `id`, `name`, `created_at`. These columns are simple to set up as a static object.
- dynamic columns - e.g. stocks, attributes, channels. These column values are not known in advance and must be fetched from the API.

For identification, every column has an ID. It is a string that is unique within the view. For example, `id` column has ID `id`, `name` column has ID `name`.

For dynamic columns, the naming convetion is as follows:

```
column_name:column_id
```

For example:

```
attribute:QXR0cmlidXRlOjIx
```

### useColumns hook

`useColumns` is a custom hook that is used as single source of truth for both Datagrid and Column Picker. It returns an object with the following properties:

- visible columns - array of visible columns for the datagrid
- static columns - array of static columns for the column picker
- dynamic columns - array of dynamic columns for the column picker
- column categories - array of column categories, which is abstraction for dynamic column. For example attributes is a column category, whereas Flavor attribute is an actual column value. This object has all API-related properties, like search handler, fetch more props, etc.
- selected columns - array of column IDs which are selected in the column picker. It is saved in local storage
- recently added column - this value is used in datagrid component to enable auto-scroll to newly added column
- handlers:
  - onResize (for datagrid)
  - onMove (for datagrid)
  - onToggle (for column picker)
  - onClearRecentlyAddedColumnn - passed to datagrid to prevent extra scrolling to last column after it has already happened
  - onCustomUpdateVisible - used to manually update visible columns state. For now it is required to update arrow icon in the datagrid columns
  - onResetDynamicToInitial - used to manually trigger dynamic column recalculation from initial parameters.

In order to use this hook, you need to provide two/three things:

- `staticColumns` - array of static columns in datagrid-ready format (`AvailableColumns[]`)
- `columnCategories` - array of column categories (only if there are any dynamic columns)
- state & setter of column settings which we get from `useListSettings`

## Adapting new views

### Selected columns in LS

Firstly, in the view file, we need to provide settings object which holds seleted columns IDs. We should use `useListSettings` hook for that.

```tsx
const { updateListSettings, settings } = useListSettings(
  ListViews.PRODUCT_LIST,
);

// Translates columnIDs to api IDs
const filteredColumnIds = settings.columns
  .filter(isAttributeColumnValue)
  .map(getAttributeIdFromColumnValue);

const gridAttributes = useGridAttributesQuery({
  variables: { ids: filteredColumnIds },
  skip: filteredColumnIds.length === 0,
});
```

### Static columns adapter

Writing an adapter for static columns is an easy task. We need to provide an array of static columns in datagrid-ready format (`AvailableColumns[]`).

For example:

```tsx
export const parseStaticColumnsForProductListView = (intl, emptyColumn, sort) =>
  [
    emptyColumn,
    {
      id: "name",
      title: intl.formatMessage(commonMessages.product),
      width: 300,
      icon: getColumnSortIconName(sort, ProductListUrlSortField.name),
    },
    {
      id: "productType",
      title: intl.formatMessage(columnsMessages.type),
      width: 200,
      icon: getColumnSortIconName(sort, ProductListUrlSortField.productType),
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));
```

Empty column is a special column that is used to add padding in the datagrid. It is filtered out by the column picker.

### Dynamic column adapter

This function creates ColumnCategory[] object from available data.

Creating a column category requires two queries per category. Let's say we want to have custom attributes as columns. We need

- query which fetches all attributes
- query which fetches selected attributes

We cannot rely on single query, because searching through attributes would influence already selected columns which are visible in the datagrid.

Example:

```tsx
export const parseDynamicColumnsForProductListView = ({
  attributesData,
  gridAttributesData,
  activeAttributeSortId,
  sort,
  onSearch,
  onFetchMore,
  hasNextPage,
  hasPreviousPage,
  totalCount,
}) => [
  {
    name: "Attributes",
    prefix: "attribute",
    availableNodes: parseAttributesColumns(
      attributesData, // all attributes
      activeAttributeSortId,
      sort,
    ),
    selectedNodes: parseAttributesColumns(
      gridAttributesData, // selected attributes
      activeAttributeSortId,
      sort,
    ),
    onSearch,
    onFetchMore,
    hasNextPage,
    hasPreviousPage,
    totalCount,
  },
];
```

Here we only have 1 column category, attributes. `attributesData` is the result of the first query, `gridAttributesData` is the result of the second query. We also provide pagination props, which are used in the column picker.

Let's have a look at the first query:

```tsx
export const availableColumnAttribues = gql`
  query AvailableColumnAttributes(
    $search: String!
    $before: String
    $after: String
    $first: Int
    $last: Int
  ) {
    attributes(
      filter: { search: $search }
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;
```

This query is used to fetch all **available** attributes. It is paginated and has a search filter and results are displayed in the left part of the column picker.

The second query is similar, but it has a filter of IDs, which come from local storage settings (useListSettings):

```tsx
export const gridAttributes = gql`
  query GridAttributes($ids: [ID!]!) {
    grid: attributes(first: 25, filter: { ids: $ids }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
```

Data of this query is displayed in the right part of the column picker, below the static columns.

Here is the adapter for the dynamic columns inside the category:

```tsx
export const parseAttributesColumns = (
  attributes: RelayToFlat<
    SearchAvailableInGridAttributesQuery["availableInGrid"]
  >,
  activeAttributeSortId: string,
  sort: Sort<ProductListUrlSortField>,
) =>
  attributes.map(attribute => ({
    id: `attribute:${attribute.id}`,
    title: attribute.name,
    metaGroup: "Attribute",
    width: 200,
    icon:
      attribute.id === activeAttributeSortId &&
      getColumnSortIconName(sort, ProductListUrlSortField.attribute),
  }));
```

With the dynamic column adapter written, we can now use the `useColumns` hook.
