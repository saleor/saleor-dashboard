---
name: saleor-dashboard-graphql-batching
description: >
  Saleor API request limits for batched GraphQL documents. Use when sending several
  aliased mutations or queries in one request, building GraphQL documents at runtime,
  or choosing a chunk size for bulk assign/unassign/update loops.
---

# Batched GraphQL requests

Saleor validates every document against per-request limits before running it. Over a
limit, the whole request fails with a top-level error and `data: null`; no part of it
runs.

| Limit            | Default | Env var                        | What counts                                                                    |
| ---------------- | ------- | ------------------------------ | ------------------------------------------------------------------------------ |
| Mutations        | **4**   | `GRAPHQL_MUTATION_COUNT_LIMIT` | Top-level fields of every `mutation` operation in the document, aliased or not |
| Aliases          | 100     | `GRAPHQL_ALIAS_COUNT_LIMIT`    | Every aliased field anywhere in the document, nested ones included             |
| Query complexity | 50000   | `GRAPHQL_QUERY_MAX_COMPLEXITY` | Cost of the whole document                                                     |

Source: `saleor/graphql/core/validators/` and `saleor/settings.py` in Saleor core.

## Rules

- Chunk aliased mutations at **4 or fewer** per document. Do not assume an instance
  raised the limit; test instances often use 10, which hides the bug locally.
- Keep aliased queries well under 100 aliases per document, counting nested aliases.
- Name the chunk size as a constant with a comment citing the limit, and cover it with
  a unit test.
- Use `errorPolicy: "all"` and treat a missing alias in `data` as a failure, so a
  rejected document reports every entity in that chunk as failed.

See `runWarehouseLinkUpdates` in `src/warehouses/warehouseChannelMembership.ts` for an
example: it chunks by `MEMBERSHIP_UPDATE_CHUNK_SIZE` and marks a rejected chunk as failed.
