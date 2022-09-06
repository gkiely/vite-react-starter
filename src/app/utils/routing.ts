/* c8 ignore start */
import { createElement, Dispatch, ReactNode, SetStateAction } from 'react';
import service, { routerMachine } from '../machines/routerMachine';
import * as Components from '../components';
import * as Sections from '../sections';
import { assertType } from 'utils';
import { Intersect } from 'utils/types';
import { InterpreterFrom } from 'xstate';

type C = typeof Components;
type S = typeof Sections;

type Props = {
  [K in keyof C]: { component: K; id: string } & Parameters<C[K]>[number];
};

export type ComponentConfig = Props[keyof C];

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

export const useSend = () => service.send;

export const createRenderer = <S>(
  fn: (store: S, state: InterpreterFrom<typeof routerMachine>['state']) => RouteConfig
) => fn;

export type SetState<S> = Dispatch<SetStateAction<S>>;

export const renderIf = <T>(flag: boolean, data: T): [T] | [] => {
  return flag ? [data] : [];
};

export const renderComponentIf = <T>(
  flag: boolean,
  data: Readonly<T> & { component: keyof C; id: string }
): [Readonly<T> & { component: keyof C; id: string }] | [] => {
  return flag ? [data] : [];
};

export const expectType = <T>(data: T): T => data;

export type ComponentProps = Props[keyof C];
export const renderComponent = (props: ComponentProps) => {
  const Component = Components[props.component];
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
