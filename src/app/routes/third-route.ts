/* c8 ignore start */
import { createRenderer } from 'utils/routing';

export const render = createRenderer(() => {
  return {
    title: 'Third Route',
    sections: [
      {
        id: 'section-main',
        section: 'Row',
        children: [
          { componentId: 'sidebar' },
          {
            id: 'section-content',
            section: 'Column',
            children: [{ componentId: 'content-header' }, { componentId: 'content' }],
          },
        ],
      },
      {
        id: 'section-second',
        section: 'Row',
        children: [{ componentId: 'content-second' }],
      },
    ],
    components: [
      {
        id: 'sidebar',
        component: 'Sidebar',
        title: 'Sidebar',
      },
      {
        id: 'content-header',
        component: 'Content',
        text: 'Content header',
        link: {
          text: 'Second route',
          to: '/second',
        },
        button: {
          text: 'Back to second route',
          to: '/second',
        },
      },
      {
        id: 'content',
        component: 'Content',
        text: 'Content body',
      },
      {
        id: 'content-second',
        component: 'Content',
        text: 'Content second',
      },
    ],
  };
});

/* c8 ignore stop */
