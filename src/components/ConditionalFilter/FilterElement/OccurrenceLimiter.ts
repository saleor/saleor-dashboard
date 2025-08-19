import { OCCURRENCE_LIMITS } from "../constants";
import { LeftOperand } from "../LeftOperandsProvider";
import { FilterContainer, FilterElement } from "./FilterElement";

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

  public countOccurrences(container: FilterContainer): number {
    return container.filter(element => {
      if (!FilterElement.isCompatible(element)) return false;

      return element.value.value === this.fieldName;
    }).length;
  }

  public hasReachedLimit(container: FilterContainer): boolean {
    return this.countOccurrences(container) >= this.maxOccurrences;
  }

  public static filterAvailableOperands(
    operands: LeftOperand[], 
    container: FilterContainer
  ): LeftOperand[] {
    return operands.filter(operand => {
      const limiter = OccurrenceLimiter.fromSlug(operand.value);

      if (!limiter) return true; // No limit defined
      
      return !limiter.hasReachedLimit(container);
    });
  }
}