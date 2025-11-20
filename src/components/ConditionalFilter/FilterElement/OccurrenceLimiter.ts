import { OCCURRENCE_LIMITS } from "../constants";
import { LeftOperand } from "../LeftOperandsProvider";
import { FilterContainer, FilterElement } from "./FilterElement";

/** Limit input options availability on the list, based on occurrences in already selected filters
 * This is used, e.g. to limit address fields in Order where filter where user cannot specify the same filed multiple times
 * (e.g. there can be only 1 `billindAddress.country`) */
export class OccurrenceLimiter {
  constructor(
    public fieldName: string,
    public maxOccurrences: number,
  ) {}

  public static fromSlug(slug: string): OccurrenceLimiter | null {
    const limit = OCCURRENCE_LIMITS[slug as keyof typeof OCCURRENCE_LIMITS];

    if (!limit) return null;

    return new OccurrenceLimiter(slug, limit.maxOccurrences);
  }

  private countOccurrences(container: FilterContainer): number {
    return container.filter(element => {
      if (!FilterElement.isFilterElement(element)) return false;

      return element.value.value === this.fieldName;
    }).length;
  }

  private hasReachedLimit(container: FilterContainer): boolean {
    return this.countOccurrences(container) >= this.maxOccurrences;
  }

  public static filterAvailableOperands(
    operands: LeftOperand[],
    container: FilterContainer,
  ): LeftOperand[] {
    return operands.filter(operand => {
      const limiter = OccurrenceLimiter.fromSlug(operand.value);

      if (!limiter) return true; // No limit defined

      return !limiter.hasReachedLimit(container);
    });
  }
}
