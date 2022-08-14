/* c8 ignore start */
import { Store } from 'server/schemas';
import { createRenderer } from 'utils/routing';

export const render = createRenderer<Store>((state) => {
  return {
    layout: [
      {
        section: 'Row',
        children: [
          { component: 'sidebar' },
          {
            section: 'Row',
            children: [{ component: 'header' }, { component: 'content' }],
          },
        ],
      },
    ],
    components: [
      {
        id: 'sidebar',
        component: 'Sidebar',
      },
      {
        id: 'content',
        component: 'Content',
      },
    ],
  };
});

/* c8 ignore stop */
