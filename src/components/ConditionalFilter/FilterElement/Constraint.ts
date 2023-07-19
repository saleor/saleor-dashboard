import { CONSTRAINTS } from "../constants"
import { StaticElementName } from "./ConditionOptions"

type DisabledScope = "left" | "right" | "condition"

export class Constraint {
  constructor(
    public dependsOn: string,
    public disabled?: [DisabledScope],
    public removable?: boolean,
  ) {}

  public static getDependency (slug: string): StaticElementName | null {
    const fieldConstraint = CONSTRAINTS[slug as keyof typeof CONSTRAINTS]

    if (!fieldConstraint) return null

    return fieldConstraint.dependsOn as StaticElementName
  }

  public static fromSlug(slug: string) {
    const fieldConstraint = CONSTRAINTS[slug as keyof typeof CONSTRAINTS]

    if (!fieldConstraint) return null

    return new Constraint(
      fieldConstraint.dependsOn,
      fieldConstraint.disabled as [DisabledScope],
      fieldConstraint.removable
    )
  }

  public withDisabledScope (scope: [DisabledScope]) {
    this.disabled = scope

    return this
  }

  public cannotBeRemoved () {
    this.removable = true

    return this
  }

  public canBeRemoved () {
    this.removable = false

    return this
  }
}