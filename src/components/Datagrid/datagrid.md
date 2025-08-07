# Datagrid

Datagrid component is a wrapper for NPM's package `@glideapps/glide-data-grid`, providing easy (ok, at least easiest than implementing it from scratch) integration with Saleor Dashboard's forms.

## Forms

A good and easy example would be `src/components/Datagrid/Datagrid.stories.tsx` file as it represents minimal setup to get datagrid component up and running.

The most important thing is to provide React Context (avoid prop-drilling through multiple intermediate components) in form component definition:

```jsx
const Form = ({ children }) => {
  // This one is not needed by datagrid component and is put here just because
  // we assumed it's a form component
  const formProps = useForm({});
  const datagridProps = useDatagridChangeState();

  return (
    <DatagridChangeStateContext.Provider value={changeProps}>
      {children}
    </DatagridChangeStateContext.Provider>
  );
};
```

It creates a state which holds _all changes_ made in datagrid. Please not that it holds only changes and not whole state, which greatly simplifies pruning identity mutations (updating object with the same data). When the context is set, the next step begins.

## Accessors

Original component from `@glideapps/glide-data-grid` requires user to provide callback function to get data, instead of passing 2D array. [Docs can be found here](https://glideapps.github.io/glide-data-grid/?path=/story/glide-data-grid-docs--getting-started), but we introduced a few additional concepts.

- `getCellContent` is augmented with additional data denoted by following interface:

  ```typescript
  export interface GetCellContentOpts {
    changes: React.MutableRefObject<DatagridChange[]>;
    added: number[];
    removed: number[];
    getChangeIndex: (column: string, row: number) => number;
  }
  ```

  It allows us to correctly map indices used by datagrid to original data from API (or any other source) and to display updated data instead of original one.

  Note that `getCellContent` should return not only display value but all settings regarding particular cell. To make this easier and less mundane work, we created utility functions which can be found in `src/components/Datagrid/cells.ts` file.

- we introduces `getCellError` accessor to be able to map validation errors to their respective cells - this way we can handle partial save (let's say save 3 out of 4 updated variants) and display red background where validation failed. It uses the same `GetCellContentOpts` object as second argument as `getCellContent`.

## Adding and removing rows

Datagrid component fully supports adding and removing rows on the fly.

- Adding rows work out-of-the-box by passing `addButtonLabel` as prop to component.
- `selectionActions` prop is used for all actions that appear after selecting rows, such as deletion or publication. You can pass a list of buttons that use actions from `MenuItemsActions` interface. Currently only deleting rows is supported out of the box.

## API

After we set up form and accessors, we need a way to send this data to API. This will vary depending on available API (especially if we can use bulk update API or not). Implementation stitching five different mutations can be found in `src/products/views/ProductUpdate/handlers/useProductUpdateHandler.ts` file. It's important to reduce response size, time and render count by requesting only error list and refetch whole list after all mutations are fulfilled.

## Error Handling

This part is also greatly affected by the API as it requires mapping potentially various GraphQL objects to combination of row and column ID. What we found useful during implementing datagrid in variants list is creating objects, which contain data like variant ID, warehouse/channel ID and error code, which then `getCellError` can easily interpret and pin to particular cell. This code can be found in `src/products/views/ProductUpdate/handlers/errors.ts` file.

After successful submission to API we need to clean all changes that were saved and leave those which weren't. In `src/products/components/ProductUpdatePage/form.tsx` we can see that after submission changes are cleared if no error was found. Beacuse of possibility that data in one row can be saved using multiple mutations, developers should write their own logic to specify which fields were saved and which were not, given the list of errors.

## Summary

Wrapping everything up - to use datagrid component, you need to take care of:

1. connecting it to form
2. create accessors `getCellContent`
3. create save handler
4. update list of errors
5. clean changes array from already saved ones.
