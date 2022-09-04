import { toEnum } from 'utils';

export const paths = ['', '/', '/second', '/third'] as const;

export type Path = typeof paths[number];

export const pathsEnum = toEnum(paths);
