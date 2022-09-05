import {
  assign,
  Actor,
  spawn,
  AnyInterpreter,
  StateMachine,
  StateSchema,
  ContextFrom,
  EventFrom,
  EventObject,
  UpdateObject,
} from 'xstate';
import { assertType, pick } from 'utils';

/* c8 ignore start */
// <DefaultContext, StateSchema, EventObject>
export const spawnMachine = <
  Machine extends StateMachine<Machine['context'], StateSchema, EventFrom<Machine>>,
  K extends ContextFrom<Machine>,
  V extends Machine['context'][K]
>(
  machine: Machine
) => {
  return {
    entry: [
      assign<{ actors: Actor[] }>({
        actors: (context) => {
          const keys = Object.keys(machine.context as Partial<Record<K, V>>);
          const data = pick(context as Record<K, V>, ...keys);
          return [...context.actors, spawn(machine.withContext(data), { sync: true })] as Actor[];
        },
      }),
    ],
    exit: (context: { actors: Actor[] }) => {
      context.actors.forEach((actor) => actor.stop?.() as unknown);
    },
  };
};

export const sync = <C extends Record<string, unknown>, E extends EventObject>(
  ...keys: (keyof C)[]
) => ({
  '*': {
    actions: (context: { actors: Actor[] }, event: E) => {
      context.actors.forEach((actor) => {
        assertType<AnyInterpreter>(actor);
        const { nextEvents } = actor.state;
        if (nextEvents.includes(event.type) || nextEvents.includes('*')) {
          actor.send(event);
        }
      });
    },
  },
  'xstate.update': {
    actions: assign<C, E>((_, event) => {
      assertType<UpdateObject>(event);
      assertType<C>(event.state.context);
      return pick<C, keyof C>(event.state.context, ...keys);
    }),
  },
});

export const matches = (state: string, service: AnyInterpreter): boolean => {
  return Object.values(service.state.children).some((child) => {
    assertType<AnyInterpreter>(child);
    if (typeof child.state === 'undefined') return false;
    if (child.state.matches(state)) return true;

    const prefix = state.replace(/\.[^.]+$/, '');
    const postfix = state.replace(/^.+\./, '');
    return Boolean(child.children?.size) && child.state.toStrings().includes(prefix)
      ? matches(postfix, child)
      : child.state.matches(state);
  });
};
/* c8 ignore stop */
