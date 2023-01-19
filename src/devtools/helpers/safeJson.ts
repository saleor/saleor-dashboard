export const stringify = (
  value: any,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number
): string => {
  if (!value) {
    return ""
  }
  try {
    return JSON.stringify(value, replacer, space)
  } catch (e) {
    return "{}"
  }
}

export const parse = <T extends {}>(
  text?: string,
  reviver?: (this: any, key: string, value: any) => any
): T | null => {
  try {
    return JSON.parse(text as string, reviver)
  } catch (e) {
    return null
  }
}
