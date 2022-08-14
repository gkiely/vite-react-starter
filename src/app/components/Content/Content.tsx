import { useSend } from 'utils/routing';
import * as styles from './Content.css';

export type Props = unknown;

/* c8 ignore start */
const Content = (props: Props) => {
  const send = useSend();
  return <div className={styles.content}>Content</div>;
};
/* c8 ignore stop */

export default Content;
