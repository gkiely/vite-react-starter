import { useSend } from 'utils/routing';
import * as styles from './Sidebar.css';

export type Props = unknown;

/* c8 ignore start */
const SideBar = (props: Props) => {
  const send = useSend();
  return <div className={styles.sidebar}>Content</div>;
};
/* c8 ignore stop */

export default SideBar;
