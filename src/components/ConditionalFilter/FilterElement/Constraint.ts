import { CONSTRAINTS } from "../constants";
import { StaticElementName } from "./ConditionOptions";
import { FilterContainer, FilterElement } from "./FilterElement";

export const GLOBAL = "GLOBAL" as const;

type DisabledScope = "left" | "right" | "condition";

export class Constraint {
  public readonly dependsOn: string[];

  public readonly isGlobal: boolean;

  constructor(
    dependsOnOrGlobal: string[] | typeof GLOBAL,
    public disabled?: DisabledScope[],
    public removable?: boolean,
  ) {
    if (dependsOnOrGlobal === GLOBAL) {
      this.dependsOn = [];
      this.isGlobal = true;
    } else {
      this.dependsOn = dependsOnOrGlobal;
      this.isGlobal = false;
    }
  }

  public static getDependency(slug: string): StaticElementName | null {
    const fieldConstraint = Object.entries(CONSTRAINTS).find(([_, v]) =>
      v.dependsOn.includes(slug),
    );

    if (!fieldConstraint) return null;

    return fieldConstraint[0] as StaticElementName;
  }

  public static fromSlug(slug: string): Constraint | null {
    const constraintKey = Object.keys(CONSTRAINTS).find(key => key === slug);

    if (!constraintKey) return null;

    const fieldConstraint = CONSTRAINTS[constraintKey as keyof typeof CONSTRAINTS];

    return new Constraint(
      fieldConstraint.dependsOn,
      fieldConstraint.disabled as DisabledScope[],
      fieldConstraint.removable,
    );
  }

  public existIn(container: FilterContainer): boolean {
    // We mark as existing, in order to not get removed by useContainerState
    // constraints cleanup - global constraint are not tied to any filter row.
    if (this.isGlobal) {
      return true;
    }

    if (this.dependsOn.length === 0) {
      return false;
    }

    return container.some(s => {
      if (!FilterElement.isFilterElement(s)) return false;

      return this.dependsOn.includes(s.value.value);
    });
  }
}
