import { ConditionValue, isItemOption, isTuple } from "../FilterElement/ConditionValue";
import { QueryVarsBuilderUtils } from "./utils";

/**
 * Formats a date/datetime value to proper ISO DateTime string
 */
const formatDateTime = (value: string): string => {
  if (!value || value.trim() === "") {
    return "";
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
};

/**
 * Gets end of day (23:59:59.999Z) for a date value
 */
const getEndOfDay = (value: string): string => {
  if (!value || value.trim() === "") {
    return "";
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return "";
  }

  date.setUTCHours(23, 59, 59, 999);

  return date.toISOString();
};

/**
 * Checks if the value includes a time component
 */
const hasTimeComponent = (value: string): boolean => {
  // Check for time patterns like "HH:mm" or "T HH:mm"
  return /\d{2}:\d{2}/.test(value) || /T/.test(value);
};

/**
 * Adds one minute to a datetime string
 */
const addOneMinute = (isoString: string): string => {
  const date = new Date(isoString);

  date.setUTCMinutes(date.getUTCMinutes() + 1);

  return date.toISOString();
};

const buildDateFilter = (selectedValue: ConditionValue, label: string) => {
  if (label === "lower") {
    const value = QueryVarsBuilderUtils.extractValueFromOption(selectedValue);

    const formattedValue = formatDateTime(value);

    return formattedValue ? { lte: formattedValue } : undefined;
  }

  if (label === "greater") {
    const value = QueryVarsBuilderUtils.extractValueFromOption(selectedValue);
    const formattedValue = formatDateTime(value);

    return formattedValue ? { gte: formattedValue } : undefined;
  }

  if (isTuple(selectedValue) && label === "between") {
    const [gte, lte] = selectedValue;

    return {
      gte: formatDateTime(String(gte)),
      lte: formatDateTime(String(lte)),
    };
  }

  /** Handle incorrect usage of dates in UI:
   * - Date -> convert to DateTime, since it's required by API
   *   How to fix properly: allow choosing DateTime in UI
   * - Date / DateTime "eq" -> convert to range with "gte" and "lte"
   *   either using 1 min timespan or 1 day (midnight - 23:59:59)
   *   How to fix properly: remove "eq" option, allow choosing only ranges
   * " */
  if (typeof selectedValue === "string" || isItemOption(selectedValue)) {
    const value = isItemOption(selectedValue) ? selectedValue.value : selectedValue;
    const gte = formatDateTime(value);

    if (!gte) {
      return undefined;
    }

    const lte = hasTimeComponent(value) ? addOneMinute(gte) : getEndOfDay(gte);

    return { gte, lte };
  }
};

export const QueryVarsDateUtils = {
  formatDateTime,
  getEndOfDay,
  hasTimeComponent,
  addOneMinute,
  buildDateFilter,
};
