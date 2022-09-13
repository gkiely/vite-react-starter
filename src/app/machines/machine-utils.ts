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
import type { EmptyInterpreter } from 'types';

export const idMap: Record<string, string[]> = {};

/* c8 ignore start */
export const spawnMachine = <
  Machine extends StateMachine<Machine['context'], StateSchema, EventFrom<Machine>>,
  K extends ContextFrom<Machine>,
  V extends Machine['context'][K]
>(
  machine: Machine
) => {
  // Save all spawned machine stateIds
  // Used to generate types for state.matches()
  if (import.meta.env.DEV) {
    idMap[machine.id] = machine.stateIds;
  }

  return {
    entry: [
      // () => console.log('spawnMachine entry:', machine.id),
      assign<{ actors: Actor[] }>({
        actors: (context) => {
          const keys = Object.keys(machine.context as Partial<Record<K, V>>);
          const data = pick(context as Record<K, V>, ...keys);
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
        context.actors.find((o) => o.id !== machine.id)?.stop?.();
      },
      assign<{ actors: Actor[] }>((context) => ({
        actors: context.actors.filter((o) => o.id !== machine.id),
      })),
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
        const { nextEvents } = actor.getSnapshot();
        if (nextEvents.includes(event.type) || nextEvents.includes('*')) {
          // console.log(event.type, actor.id, context, nextEvents);
          actor.send(event);
        }
      });
    },
  },
  ...(keys.length && {
    'xstate.update': {
      actions: assign<C, E>((context, event) => {
        assertType<UpdateObject>(event);
        assertType<C>(event.state.context);
        return pick<C, keyof C>(event.state.context, ...keys);
      }),
    },
  }),
});

export const matches = (query: string, service: AnyInterpreter | EmptyInterpreter): boolean => {
  return Object.values(service.getSnapshot()?.children ?? {}).some((child) => {
    assertType<AnyInterpreter>(child);
    const snapshot = child.getSnapshot();
    if (!snapshot) return false;

    const prefix = query.replace(/\.[^.]+$/, '');
    const postfix = query.replace(/^.+\./, '');
    if (child.id === prefix && snapshot.matches(postfix)) return true;

    return child.children?.size ? matches(query, child) : snapshot.matches(query);
  });
};
/* c8 ignore stop */
