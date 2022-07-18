import { Dispatch, SetStateAction, useContext, useMemo } from 'react';
import { assertType, generateId, isObject, omit } from 'utils';
import type * as Components from '../components';
import { RouteContext } from '../SendContext';

type ComponentName = keyof typeof Components;
type GetComponentProps<K extends ComponentName = ComponentName> = Omit<
  Parameters<typeof Components[K]>[number],
  'component' | 'key'
>;
// type GetAllComponentProps<K extends ComponentName = ComponentName> = Parameters<
//   typeof Components[K]
// >[number];

type ComponentProps = GetComponentProps;

// type ComponentPropsMapped = {
//   [K in ComponentName]: GetComponentProps<K>;
// };

export type Action<T = string, P = unknown> = {
  type: T;
  payload?: P;
};

type Base = {
  id?: string;
  action?: Action;
};

export type Element<P = Record<string, unknown>> = Base & {
  element: string;
} & { [K in keyof P]: P[K] };

export type RouteComponent<P extends ComponentProps = ComponentProps> = Base & {
  props: Omit<P, 'component' | 'key'>;
  component: ComponentName;
};

export type Component<P, N = ComponentName> = Base & {
  component: N;
} & { [K in keyof P]: P[K] };

export type RouteConfig<P extends ComponentProps = ComponentProps> = Readonly<{
  sections?: string[];
  components: RouteComponent<P>[];
}>;

export type PreparedRouteConfig<P extends ComponentProps = ComponentProps> = Readonly<{
  sections?: string[];
  components: Component<P>[];
}>;

type SetState<S> = Dispatch<SetStateAction<S>>;
export type UpdateAction<S> = Partial<S> | ((prevState: Readonly<S>) => Partial<S>);
/* c8 ignore start */
export const createClientRoute = <S, U = string>(
  fn: () => readonly [PreparedRouteConfig, Dispatch<Action<U>>, Dispatch<UpdateAction<S>>]
) => fn;
export const createServerRoute = (fn: () => PreparedRouteConfig | Promise<PreparedRouteConfig>) =>
  fn;
export const createRenderer =
  <S, P extends ComponentProps>(render: (state: Readonly<S>) => RouteConfig<P>) =>
  (state: Readonly<S>): PreparedRouteConfig<P> =>
    prepareRoute(render(state));

export const createUpdate = <S>(setState: SetState<S>) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useMemo(() => {
    return (arg: UpdateAction<S>) => {
      if (typeof arg === 'function') {
        assertType<(prevState: S) => Partial<S>>(arg);
        return setState(s => ({
          ...s,
          ...arg(s),
        }));
      }
      return setState(s => ({
        ...s,
        ...arg,
      }));
    };
  }, [setState]);

export const createSend =
  <S, A>(setState: SetState<S>, reducer: (state: S, action: A) => S) =>
  (action: A) =>
    setState(state => reducer(state, action));

// TODO: add development check to make sure there are no duplicate actions used
export const createReducer = <S, A>(
  fn: (state: Readonly<S>, action: Readonly<Action<A>>) => S,
  actions?: A[]
) => {
  return (state: Readonly<S>, action: Readonly<Action<A>>) => {
    if (!actions || actions.length === 0 || actions.includes(action.type)) {
      return fn(state, action);
    }
    return state;
  };
};

/**
 * Generates id's for components and elements
 * Moves props for child elements from object key to directly passed to the element
 */
const [getId, resetIds] = generateId();
export const prepareRoute = <P extends ComponentProps>(
  route: RouteConfig
): PreparedRouteConfig<P> => {
  resetIds();
  return {
    ...route,
    components: route.components.map(component => {
      const id = component.id ?? `${getId(component.component)}`;
      return {
        ...(omit(component, ['props']) as Component<P>),
        id,
        key: id,
        ...Object.entries(component.props).reduce((curr, acc) => {
          const [key, value] = acc;
          if (Array.isArray(value)) {
            return {
              ...curr,
              [key]: value.map(v => {
                if (isObject(v) && ('element' in v || 'component' in v)) {
                  assertType<{
                    id?: string;
                    element?: string;
                    component?: string;
                    props?: Record<string, unknown>;
                  }>(v);
                  return {
                    ...(v.props
                      ? {
                          ...v.props,
                          ...omit(v, ['props']),
                        }
                      : v),
                    id: v.id ?? `${getId(v.element)}` ?? `${getId(v.component)}`,
                  };
                }
                return v as unknown;
              }),
            };
          }
          return {
            ...curr,
            [key]: value,
          };
        }, {}),
      };
    }),
  };
};

export const useSend = () => useContext(RouteContext).send;
export const useUpdate = () => useContext(RouteContext).update;

type Reducer<S, A> = (state: Readonly<S>, action: Readonly<Action<A, unknown>>) => S;

export const combineReducers = <S, A>(...reducers: Reducer<S, A>[]) => {
  return (state: S, action: Action<A>) => {
    return reducers.reduce((curr, acc) => acc(curr, action), state);
  };
};

/* c8 ignore stop */
