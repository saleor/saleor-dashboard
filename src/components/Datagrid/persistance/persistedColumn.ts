import { AvailableColumn } from "../types";

export interface RawColumn {
  id: string;
  w: number;
}

export class PersistedColumn {
  constructor(
    public id: string,
    public width: number,
  ) {}

  public static fromRaw(raw: RawColumn) {
    return new PersistedColumn(raw.id, raw.w);
  }

  public static withDefaultWith(id: string) {
    return new PersistedColumn(id, 200);
  }

  public static fromAvailableColumn(column: AvailableColumn) {
    return new PersistedColumn(column.id, column.width);
  }

  public equalsById(id: string) {
    if (id === this.id) {
      return true;
    }

    return this.id.split(":")[1] === id;
  }

  public mergeWithAvailableColumn(column: AvailableColumn): AvailableColumn {
    return { ...column, width: this.width };
  }

  public asRaw() {
    return { id: this.id, w: this.width };
  }

  public identifier() {
    return this.id;
  }
}
