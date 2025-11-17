# Find Unused GraphQL Operations

This script helps you identify GraphQL operations (queries, mutations, and fragments) that are defined in the codebase but never actually used.

## Usage

```bash
node scripts/find-unused-graphql-operations.js
```

## How It Works

The script performs the following steps:

1. **Scans GraphQL operation files** - Finds all `queries.ts`, `mutations.ts`, and `fragments/*.ts` files in the `src/` directory

2. **Extracts operation names** - Parses each file to extract the operation names from GraphQL definitions:
   - Queries: `query QueryName { ... }`
   - Mutations: `mutation MutationName { ... }`
   - Fragments: `fragment FragmentName on Type { ... }`

3. **Generates expected usage names** - For each operation, generates the names that graphql-codegen creates:
   - Queries → `QueryNameDocument`, `useQueryNameQuery`, `useQueryNameLazyQuery`, `QueryNameQuery`, `QueryNameQueryVariables`
   - Mutations → `MutationNameDocument`, `useMutationNameMutation`, `MutationNameMutation`, `MutationNameMutationVariables`
   - Fragments → `FragmentNameFragmentDoc`, `FragmentNameFragment`

4. **Searches the codebase** - Scans all TypeScript files (excluding generated files and operation definitions) to check if any of the generated names are used

5. **Reports unused operations** - Lists all operations where none of the generated names could be found in the codebase

## Output

The script outputs:

- Summary of how many operations were found and how many are unused
- Detailed list of unused operations grouped by type (queries, mutations, fragments)
- For each unused operation:
  - Operation name
  - Export name
  - File path

### Example Output

```
🔍 Finding unused GraphQL operations...

📁 Scanning GraphQL files...
   Found 38 query files
   Found 35 mutation files
   31 fragment files

📊 Found 606 total operations:
   140 queries
   226 mutations
   240 fragments

📄 Loading TypeScript files...
   Found 3196 files to search

🔎 Reading files and checking for usage...
   Processed 3196/3196 files.

════════════════════════════════════════════════════════════════════════════════
📈 SUMMARY
════════════════════════════════════════════════════════════════════════════════
Total operations: 606
Used operations: 506
Unused operations: 100
════════════════════════════════════════════════════════════════════════════════

🔴 UNUSED QUERIES:

   • AppsInstallations
     Export: appsInProgressList
     File: src/apps/queries.ts
   ...
```

## Important Notes

- **Manual verification required**: Before removing any operation, verify that it's truly unused. Some operations might be:
  - Used dynamically (e.g., via string interpolation)
  - Used in code that wasn't scanned (e.g., test files outside src/)
  - Referenced in comments or documentation
  - Imported but used indirectly

- **Fragment dependencies**: Be careful with fragments - they might be used by other fragments or operations. The script checks if the generated fragment names are used anywhere, but nested fragment usage might not be detected if only the parent operation is used.

- **Performance**: The script processes all TypeScript files in the src/ directory. For large codebases, this may take a minute or two.

## When to Use

- Before a major refactoring to clean up dead code
- During code review to identify potential cleanup opportunities
- Periodically (e.g., monthly) as part of technical debt maintenance
- After removing features to clean up associated GraphQL operations

## Limitations

- Does not detect dynamic usage (e.g., `const queryName = 'Product' + 'List'; useQuery(queries[queryName])`)
- Does not scan test files or files outside the `src/` directory
- May report false positives for operations used in ways the script can't detect
- Does not check if fragments are used by other operations within the same file
