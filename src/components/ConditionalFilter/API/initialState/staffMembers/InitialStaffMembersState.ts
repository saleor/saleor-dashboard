import { ItemOption } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import { UrlToken } from "@dashboard/components/ConditionalFilter/ValueProvider/UrlToken";

export interface InitialStaffMembersState {
  staffMemberStatus: ItemOption[];
}

export class InitialStaffMembersStateResponse implements InitialStaffMembersState {
  constructor(public staffMemberStatus: ItemOption[] = []) {}

  public static empty() {
    return new InitialStaffMembersStateResponse();
  }

  public filterByUrlToken(token: UrlToken) {
    const entry = this.getEntryByName(token.name);

    if (!token.isLoadable()) {
      return [token.value] as string[];
    }

    return (entry as ItemOption[]).filter(({ slug }) => slug && token.value.includes(slug));
  }

  private getEntryByName(name: string): ItemOption[] {
    switch (name) {
      case "staffMemberStatus":
        return this.staffMemberStatus;
      default:
        return [];
    }
  }
}
