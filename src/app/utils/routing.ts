/* c8 ignore start */
import { createElement, Dispatch, ReactNode, SetStateAction } from 'react';
import service, { routerMachine } from '../machines/router.machine';
import * as Components from '../components';
import * as Sections from '../sections';
import { assertType } from 'utils';
import type { Intersect } from 'utils/types';
import type { ContextFrom, StateFrom } from 'xstate';
import type { Events } from 'machines/router.machine';
import { StateIds } from 'machines/types.generated';

type C = typeof Components;
type S = typeof Sections;
type K = keyof C;

type Props = {
  [K in keyof C]: { component: K; id: string } & Parameters<C[K]>[number];
};

export type ComponentConfig = Props[K];

export type LayoutConfig = {
  id: string;
  section: keyof S;
  children: ({ componentId: string } | LayoutConfig)[];
};

export type RouteConfig =
  | {
      title: string;
      components: Readonly<ComponentConfig[]>;
    }
  | {
      title: string;
      sections: LayoutConfig[];
      components: Readonly<ComponentConfig[]>;
    };

export const useSend = () => (event: Events) => service.send(event);
export const createRenderer = <C>(
  fn: (
    store: ContextFrom<typeof routerMachine>,
    state: Omit<StateFrom<typeof routerMachine>, 'matches'> & {
      matches: (query: StateIds) => boolean;
    },
    context: C | undefined
  ) => RouteConfig
) => fn;

export type SetState<S> = Dispatch<SetStateAction<S>>;

// TODO: infer the correct type without using as const
export const renderIf = <T>(flag: boolean, data: T): [T] | [] => {
  return flag ? [data] : [];
};

// TODO: ideally we don't return an empty component, we return undefined
export const renderComponentIf = <T extends K>(flag: boolean, data: Props[T]): Props[T] => {
  const emptyComponent = { component: '' };
  assertType<Props[T]>(emptyComponent);
  return flag ? data : emptyComponent;
};

export const expectType = <T>(data: T): T => data;

export type ComponentProps = Props[K];
export const renderComponent = (props: ComponentProps) => {
  const Component = Components[props.component];

  // Empty component used by renderComponentIf
  if (!props.id && (props.component as string) === '') return undefined;

  if (props.id) {
    assertType<{ key: string }>(props);
    props.key = props.id;
  }

  // Convert union to intersection type for dynamic components
  assertType<Intersect<typeof props>>(props);
  assertType<Intersect<typeof Component>>(Component);
  return createElement(Component, props);
};

/*** Layout rendering */
export const renderSection = (
  layout: LayoutConfig,
  components: readonly ComponentConfig[]
): ReactNode => {
  const Section = Sections[layout.section];
  return createElement(
    Section,
    {
      key: layout.id,
    },
    layout.children.map((layoutProps) => {
      if ('componentId' in layoutProps) {
        const props = components.find((c) => c.id === layoutProps.componentId);
        if (!props) {
          throw new Error(`Component id not found: ${layoutProps.componentId}`);
        }
        return renderComponent(props);
      }
      return renderSection(layoutProps, components);
    })
  );
};

export const getRenderedComponents = (
  layout: LayoutConfig,
  components: readonly ComponentConfig[]
): string[] =>
  layout.children
    .map((c) => ('componentId' in c ? c.componentId : getRenderedComponents(c, components)))
    .filter((s) => s)
    .flat();

// Iterate through components and render either a section or a component
export const renderLayout = (layouts: LayoutConfig[], components: readonly ComponentConfig[]) => {
  const sectionIdArray = layouts.map((l) => getRenderedComponents(l, components));
  const componentIds = sectionIdArray.flat();
  const sections = layouts.map((layout) => renderSection(layout, components));
  return components.reduce<ReactNode[]>((acc, component) => {
    if (componentIds.includes(component.id)) {
      const section = sections[sectionIdArray.findIndex((ids) => ids.includes(component.id))];
      assertType<(ReactNode & { key: string })[]>(acc);
      assertType<ReactNode & { key: string }>(section);
      const keys = acc.map((p) => p.key);
      return keys.includes(section.key) ? acc : [...acc, section];
    }
    return [...acc, renderComponent(component)];
  }, []);
};
/*** end of Layout rendering */

/* c8 ignore stop */
