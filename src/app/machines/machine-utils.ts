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
export const spawnMachine = <
  Machine extends StateMachine<Machine['context'], StateSchema, EventFrom<Machine>>,
  K extends ContextFrom<Machine>,
  V extends Machine['context'][K]
>(
  machine: Machine
) => {
  return {
    entry: [
      // () => console.log('spawnMachine entry:', machine.config.id),
      assign<{ actors: Actor[] }>({
        actors: (context) => {
          const keys = Object.keys(machine.context as Partial<Record<K, V>>);
          const data = pick(context as Record<K, V>, ...keys);
          // debugger;
          return [
            ...context.actors,
            spawn(machine.withContext({ ...machine.context, ...data }), {
              name: machine.id,
              sync: true,
            }),
          ] as Actor[];
        },
      }),
    ],
    exit: [
      // () => console.log('spawnMachine exit:', machine.config.id),
      (context: { actors: Actor[] }) => {
        context.actors.forEach((actor) => actor.stop?.() as unknown);
      },
    ],
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
  ...(keys.length && {
    'xstate.update': {
      actions: assign<C, E>((_, event) => {
        assertType<UpdateObject>(event);
        assertType<C>(event.state.context);
        return pick<C, keyof C>(event.state.context, ...keys);
      }),
    },
  }),
});

export const matches = (state: string, service: AnyInterpreter): boolean => {
  return Object.values(service.getSnapshot().children).some((child) => {
    assertType<AnyInterpreter>(child);
    const snapshot = child.getSnapshot();
    if (typeof snapshot === 'undefined') return false;
    if (snapshot.matches(state)) return true;

    const prefix = state.replace(/\.[^.]+$/, '');
    const postfix = state.replace(/^.+\./, '');
    return Boolean(child.children?.size) && snapshot.toStrings().includes(prefix)
      ? matches(postfix, child)
      : snapshot.matches(state);
  });
};
/* c8 ignore stop */
