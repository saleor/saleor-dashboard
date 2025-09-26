# Query Variable Builders

This document explains how to create and use Query Variable Builders within the ConditionalFilter system.

## Overview

Query Variable Builders transform the `FilterElement` state into GraphQL query variables. They use a **Chain of Responsibility** pattern: builders are checked in a specific order, and the first one that `canHandle` a `FilterElement` is used.

**CRITICAL**: The registration order of builders is vital. More specific builders must come before more generic ones. The `DefaultQueryVarsBuilder` must always be last.

## How to Add a New Builder

Follow these steps to add a new builder for a filter field.

### Step 1: Choose a Base Class

| Base Class                     | When to Use                                                  | Example Use Case        |
| ------------------------------ | ------------------------------------------------------------ | ----------------------- |
| `BaseMappableQueryVarsBuilder` | For simple field renaming (e.g., `channels` -> `channelId`). | Renaming a field name   |
| Implement `QueryVarsBuilder`   | For complex transformations requiring custom logic.          | `Metadata`, `Attribute` |

### Step 2: Implement the Builder

Create a new builder class.

```typescript
// src/components/ConditionalFilter/FiltersQueryBuilder/queryVarsBuilders/MyFieldQueryVarsBuilder.ts

export class MyFieldQueryVarsBuilder extends BaseMappableQueryVarsBuilder {
  // 1. Define what elements this builder can handle
  public canHandle(element: FilterElement): boolean {
    return element.value.value === "myField";
  }

  // 2. Map the UI field name to the GraphQL field name
  protected getQueryFieldName(): string {
    return "myGraphQLField";
  }

  // 3. Define how to fetch options for the filter's value
  public createOptionFetcher(client: ApolloClient<unknown>, inputValue: string): Handler {
    // Return a handler to fetch dynamic options, e.g., from an API
    return new MyFieldHandler(client, inputValue);
    // Or for static/no options:
    // return new NoopValuesHandler([]);
  }
}
```

### Step 3: Register the Builder

Add your new builder to the resolver list. For domain-specific filters, add it to the domain's query variable creation function. Ensure it's placed **before** any default or catch-all builders.

```typescript
// In e.g. src/orders/views/OrderList/filters.ts

new FilterQueryVarsBuilderResolver([
  new MyFieldQueryVarsBuilder(), // Your specific builder first
  ...FilterQueryVarsBuilderResolver.getDefaultQueryVarsBuilders(),
]);
```

## Key Patterns & Pitfalls

1.  **Registration Order**: Always register specific builders before generic ones. `DefaultQueryVarsBuilder` must be last.
2.  **Immutability**: Builders must **not** mutate the incoming `query` object. Always return a new object with the modifications.

    ```typescript
    // GOOD: Return a new object
    updateWhereQueryVariables(query, element) {
      return {
        ...query,
        myField: { eq: "some-value" },
      };
    }

    // BAD: Mutating the original object
    updateWhereQueryVariables(query, element) {
      query.myField = { eq: "some-value" }; // Don't do this!
      return query;
    }
    ```

3.  **Use Utilities**: Use `QueryVarsBuilderUtils` for safely extracting values from a `FilterElement` to handle different conditions and data types correctly.
4.  **API Support**: If your builder needs to support both the legacy `FILTER` API and the modern `WHERE` API, ensure you implement both `updateFilterQueryVariables` and `updateFilterQueryVariables`.
