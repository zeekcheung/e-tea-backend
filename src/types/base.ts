export type Primitive =
  | number
  | string
  | boolean
  | undefined
  | null
  | symbol
  | bigint;

export type UndefinedOrNullable = undefined | null;

export type Falsy = 0 | '' | false | null | undefined;

export type ClassType = new (...args: any[]) => any;
