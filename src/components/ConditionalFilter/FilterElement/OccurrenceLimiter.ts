import { type LeftOperand } from "../LeftOperandsProvider";
import { type FilterContainer, FilterElement } from "./FilterElement";

/** Limit input options availability on the list, based on occurrences in already selected filters.
 * Each LeftOperand can declare `maxOccurrences` to limit how many times it appears.
 * Operands without `maxOccurrences` are unlimited. */
export class OccurrenceLimiter {
  constructor(
    public fieldName: string,
    public maxOccurrences: number,
  ) {}

  public static fromOperand(operand: LeftOperand): OccurrenceLimiter | null {
    if (operand.maxOccurrences === undefined) return null;

    return new OccurrenceLimiter(operand.value, operand.maxOccurrences);
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
      const limiter = OccurrenceLimiter.fromOperand(operand);

      if (!limiter) return true; // No limit defined

      return !limiter.hasReachedLimit(container);
    });
  }
}
