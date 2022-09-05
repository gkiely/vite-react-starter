import { toEnum } from 'utils';

/* c8 ignore start */
export const paths = ['/', '/second', '/third', '/404'] as const;

export type Path = typeof paths[number];

export const pathsEnum = toEnum(paths);
/* c8 ignore stop */
