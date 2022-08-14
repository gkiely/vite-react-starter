import { PropsWithChildren } from 'react';
import * as styles from './sections.css';

type Props = PropsWithChildren;
/* c8 ignore start */
export const Column = ({ children }: Props) => {
  return <section className={styles.column}>{children}</section>;
};

export const Row = ({ children }: Props) => {
  return <section className={styles.row}>{children}</section>;
};
/* c8 ignore stop */
