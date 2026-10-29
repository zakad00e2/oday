// Persisted identifiers distinguish choices with identical translated names.
// Name matching is only a compatibility fallback for older saved carts.
export function findTripSelection<T extends { id: string; nameAr: string }>(
  items: T[],
  selection: { id?: string; nameAr: string },
): T | undefined {
  return selection.id
    ? items.find(item => item.id === selection.id)
    : items.find(item => item.nameAr === selection.nameAr);
}
