/// <reference types="jest" />

declare module 'ts-node/esm' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type HooksApi1 = import('ts-node').NodeLoaderHooksAPI1;

  export const resolve: HooksApi1['resolve'];
  export const load: HooksApi1['load']; // или NodeLoaderHooksAPI2['load'], если нужен API2
  export const transformSource: HooksApi1['transformSource'];
}
