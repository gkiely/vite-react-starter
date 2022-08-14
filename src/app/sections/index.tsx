import { PropsWithChildren } from 'react';
import * as styles from './sections.css';

type Props = PropsWithChildren;

export const Column = ({ children }: Props) => {
  return <section>{children}</section>;
};

export const Row = ({ children }: Props) => {
  return <section className={styles.row}>{children}</section>;
};
