import { assign, Actor, spawn, AnyInterpreter, AnyStateMachine } from 'xstate';
import { assertType, pick } from 'utils';
import { Context, Event } from './machine';

/* c8 ignore start */
export const spawnMachine = <Machine extends AnyStateMachine>(machine: Machine) => {
  return {
    entry: [
      assign<Context & { actors: Actor[] }>({
        actors: (context) => {
          const keys = Object.keys(machine.context as Context);
          const data = pick(context, ...keys);

          return [...context.actors, spawn(machine.withContext(data), { sync: true })] as Actor[];
        },
      }),
    ],
    exit: (context: { actors: Actor[] }) => {
      context.actors.forEach((actor) => actor.stop?.() as unknown);
    },
  };
};

export const sync = <C extends Partial<Context>, E extends Event>(...keys: (keyof Context)[]) => ({
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
      assertType<Extract<E, { type: 'xstate.update' }>>(event);
      return pick(event.state.context, ...keys) as C;
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
