import * as styles from './Sidebar.css';

type Props = {
  title: string;
};

/* c8 ignore start */
const SideBar = ({ title }: Props) => {
  return <div className={styles.sidebar}>{title}</div>;
};
/* c8 ignore stop */

export default SideBar;
