import type { E2eConfig } from "../config.ts";
import { manage } from "./docker.ts";

/**
 * Work Saleor defers to Celery beat. Mutations only flag rows as dirty; a periodic task
 * picks them up later. This stack runs a worker but no beat, so without these a scenario's
 * dump would capture the flags and never the result.
 *
 * `CELERY_TASK_ALWAYS_EAGER` is no substitute: it runs tasks something enqueues, and
 * nothing enqueues these - only the beat schedule does (`CELERY_BEAT_SCHEDULE` in Saleor's
 * `settings.py`). `populatedb` calls the promotion ones directly for the same reason.
 *
 * Add a task here when a scenario creates something another beat task settles.
 */
const BEAT_TASKS = [
  // Product search index - the dashboard's product pickers find nothing new without it.
  "saleor.product.tasks.update_products_search_vector_task",
  // Catalogue promotions reach prices in two passes: variants linked to rules, then
  // discounted prices recomputed.
  "saleor.product.tasks.update_variant_relations_for_active_promotion_rules_task",
  "saleor.product.tasks.recalculate_discounted_price_for_products_task",
];

/**
 * Each task handles one batch per call, so the list runs a few rounds - more than a
 * scenario's handful of rows needs. A task with nothing left to do is a no-op.
 */
const ROUNDS = 3;

/** Runs every beat task in `BEAT_TASKS` to completion, synchronously, in one container. */
export const runBeatTasks = (config: E2eConfig) =>
  manage(config, [
    "shell",
    "-c",
    [
      "from importlib import import_module",
      `for _ in range(${ROUNDS}):`,
      `    for path in ${JSON.stringify(BEAT_TASKS)}:`,
      "        module, name = path.rsplit('.', 1)",
      "        getattr(import_module(module), name)()",
    ].join("\n"),
  ]);
