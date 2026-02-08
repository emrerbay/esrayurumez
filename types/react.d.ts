/**
 * React modülü için minimal tip tanımları.
 * Tam tipler için: npm install @types/react
 */
declare module "react" {
  export interface FormEvent<T = unknown> {
    preventDefault(): void;
    currentTarget: T;
    target: EventTarget & T;
  }
  export interface ChangeEvent<T = unknown> {
    target: T & { value: string };
  }
  export function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  /** JSX bileşenlerinin döndürebileceği tipler - @types/react ile birleşir */
  export type ReactNode = ReactElement | string | number | null | undefined | boolean | ReactNode[];
  export interface ReactElement {
    type: unknown;
    props: unknown;
    key?: string | null;
    children?: ReactNode;
  }
}
