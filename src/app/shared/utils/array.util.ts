export function sortByKey<T>(
  array: readonly T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc',
): T[] {
  return [...array].sort((a, b) => {
    const cmp = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
    return order === 'asc' ? cmp : -cmp;
  });
}
