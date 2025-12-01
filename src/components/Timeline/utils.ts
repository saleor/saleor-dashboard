/**
 * Safely stringify an object for display, handling circular references
 * and removing __typename fields.
 */
export const safeStringify = (data: unknown): string => {
  if (!data) return "";

  try {
    const seen = new WeakSet();

    return JSON.stringify(
      data,
      (key, value) => {
        if (key === "__typename") return undefined;

        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) return "[Circular]";

          seen.add(value);
        }

        return value;
      },
      2,
    );
  } catch {
    return "Unable to serialize";
  }
};
