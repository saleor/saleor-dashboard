export type Unit = "mb"

const conversion: Record<Unit, number> = {
  mb: 1000000,
}

export const byteSize = (bytes: number, options?: { unit: Unit }): number => {
  return Number((bytes / conversion[options?.unit || "mb"]).toFixed(2))
}
