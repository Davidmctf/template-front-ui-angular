import { sortByKey } from './array.util';

describe('sortByKey', () => {
  const items = [
    { name: 'Banana', price: 2 },
    { name: 'Apple', price: 1 },
    { name: 'Cherry', price: 3 },
  ];

  it('ordena ascendente por clave string', () => {
    const result = sortByKey(items, 'name');
    expect(result.map((i) => i.name)).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('ordena descendente por clave string', () => {
    const result = sortByKey(items, 'name', 'desc');
    expect(result.map((i) => i.name)).toEqual(['Cherry', 'Banana', 'Apple']);
  });

  it('ordena ascendente por clave numérica', () => {
    const result = sortByKey(items, 'price');
    expect(result.map((i) => i.price)).toEqual([1, 2, 3]);
  });

  it('ordena descendente por clave numérica', () => {
    const result = sortByKey(items, 'price', 'desc');
    expect(result.map((i) => i.price)).toEqual([3, 2, 1]);
  });

  it('no muta el array original', () => {
    const original = [...items];
    sortByKey(items, 'name');
    expect(items).toEqual(original);
  });

  it('retorna array vacío si el input está vacío', () => {
    expect(sortByKey([], 'name')).toEqual([]);
  });

  it('funciona con un solo elemento', () => {
    const single = [{ name: 'Only' }];
    expect(sortByKey(single, 'name')).toEqual([{ name: 'Only' }]);
  });

  it('maneja valores iguales sin error', () => {
    const dupes = [
      { name: 'A', price: 1 },
      { name: 'A', price: 2 },
    ];
    const result = sortByKey(dupes, 'name');
    expect(result).toHaveLength(2);
  });
});
