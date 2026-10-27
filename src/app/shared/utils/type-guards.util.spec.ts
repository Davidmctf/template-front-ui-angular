import { isDefined, isNonEmptyString, isPlainObject } from './type-guards.util';

describe('isDefined', () => {
  it('retorna true para strings no vacíos', () => {
    expect(isDefined('hola')).toBe(true);
  });

  it('retorna true para 0', () => {
    expect(isDefined(0)).toBe(true);
  });

  it('retorna true para false', () => {
    expect(isDefined(false)).toBe(true);
  });

  it('retorna true para objetos', () => {
    expect(isDefined({})).toBe(true);
  });

  it('retorna false para null', () => {
    expect(isDefined(null)).toBe(false);
  });

  it('retorna false para undefined', () => {
    expect(isDefined(undefined)).toBe(false);
  });
});

describe('isNonEmptyString', () => {
  it('retorna true para string con contenido', () => {
    expect(isNonEmptyString('hola')).toBe(true);
  });

  it('retorna true para string con espacios y contenido', () => {
    expect(isNonEmptyString('  hola  ')).toBe(true);
  });

  it('retorna false para string vacío', () => {
    expect(isNonEmptyString('')).toBe(false);
  });

  it('retorna false para string solo espacios', () => {
    expect(isNonEmptyString('   ')).toBe(false);
  });

  it('retorna false para null', () => {
    expect(isNonEmptyString(null)).toBe(false);
  });

  it('retorna false para undefined', () => {
    expect(isNonEmptyString(undefined)).toBe(false);
  });

  it('retorna false para números', () => {
    expect(isNonEmptyString(42)).toBe(false);
  });

  it('retorna false para objetos', () => {
    expect(isNonEmptyString({})).toBe(false);
  });
});

describe('isPlainObject', () => {
  it('retorna true para un objeto literal', () => {
    expect(isPlainObject({})).toBe(true);
  });

  it('retorna true para objeto con propiedades', () => {
    expect(isPlainObject({ a: 1, b: 'test' })).toBe(true);
  });

  it('retorna false para null', () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it('retorna false para undefined', () => {
    expect(isPlainObject(undefined)).toBe(false);
  });

  it('retorna false para arrays', () => {
    expect(isPlainObject([])).toBe(false);
  });

  it('retorna false para strings', () => {
    expect(isPlainObject('hola')).toBe(false);
  });

  it('retorna false para números', () => {
    expect(isPlainObject(42)).toBe(false);
  });

  it('retorna false para instancias de clase', () => {
    class MyClass {}
    expect(isPlainObject(new MyClass())).toBe(false);
  });
});
