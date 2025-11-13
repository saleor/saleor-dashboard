import { CONSTRAINTS } from "../constants";
import { StaticElementName } from "./ConditionOptions";
import { FilterContainer, FilterElement } from "./FilterElement";

type DisabledScope = "left" | "right" | "condition";

export class Constraint {
  constructor(
    public dependsOn: string[],
    public disabled?: [DisabledScope],
    public removable?: boolean,
  ) {}

  public static getDependency(slug: string): StaticElementName | null {
    const fieldConstraint = Object.entries(CONSTRAINTS).find(([_, v]) =>
      v.dependsOn.includes(slug),
    );

    if (!fieldConstraint) return null;

    return fieldConstraint[0] as StaticElementName;
  }

  public static fromSlug(slug: string) {
    const constraintKey = Object.keys(CONSTRAINTS).find(key => key === slug);

    if (!constraintKey) return null;

    const fieldConstraint = CONSTRAINTS[constraintKey as keyof typeof CONSTRAINTS];

    return new Constraint(
      fieldConstraint.dependsOn,
      fieldConstraint.disabled as [DisabledScope],
      fieldConstraint.removable,
    );
  }

  public existIn(container: FilterContainer) {
    return container.some(s => {
      if (!FilterElement.isFilterElement(s)) return false;

      return this.dependsOn.includes(s.value.value);
    });
  }
}
