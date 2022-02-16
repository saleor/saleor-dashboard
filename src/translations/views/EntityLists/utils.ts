export function sumCompleted(list: any[]): number {
  return list.reduce((acc, field) => acc + (field ? 1 : 0), 0);
}
