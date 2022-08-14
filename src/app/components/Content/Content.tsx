import * as styles from './Content.css';

export type Props = {
  text: string;
};

/* c8 ignore start */
const Content = ({ text }: Props) => {
  return <div className={styles.content}>{text}</div>;
};
/* c8 ignore stop */

export default Content;
