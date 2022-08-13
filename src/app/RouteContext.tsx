// import { createContext, Dispatch, PropsWithChildren } from 'react';
// import { APIAction } from 'routes/server';

// /* c8 ignore start */
// export const RouteContext = createContext<{ send: Dispatch<APIAction> }>({
//   send: () => {},
// });

// type Props<T> = PropsWithChildren & { send: T };

// export default function Provider<T extends Dispatch<APIAction>>({ send, children }: Props<T>) {
//   return <RouteContext.Provider value={{ send }}>{children}</RouteContext.Provider>;
// }
// /* c8 ignore end */

export {};
